import Template from "../models/Template.js";
import Developer from "../models/DeveloperModel.js";
import Payout from "../models/Payout.js";

// GET /api/developer/dashboard
export const getDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const templates = await Template.find({ sellerId, status: { $ne: "archived" } });
    const developerInfo = await Developer.findOne({ userId: sellerId });

    const totalTemplates = templates.length;
    const pendingTemplates = templates.filter((t) => t.status === "pending").length;
    const approvedTemplates = templates.filter((t) => t.status === "approved").length;

    let totalDownloads = 0;
    let totalSales = 0;

    templates.forEach((t) => {
      totalDownloads += t.downloadCount || 0;
      totalSales += t.purchaseCount || 0;
    });

    const totalRevenue = developerInfo?.totalEarnings || 0;

    res.status(200).json({
      metrics: {
        totalTemplates,
        pendingTemplates,
        approvedTemplates,
        totalSales,
        totalDownloads,
        totalRevenue,
      },
      recentTemplates: templates.slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard metrics", error: err.message });
  }
};

// GET /api/developer/templates
export const getTemplates = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { status } = req.query;

    const query = { sellerId };
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: "archived" };
    }

    const templates = await Template.find(query).sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching developer templates", error: err.message });
  }
};

// POST /api/developer/templates
export const createTemplate = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const {
      title,
      description,
      category,
      price,
      isFree,
      livePreviewUrl,
      features,
      techStack,
      compatibility,
      license,
      tags,
    } = req.body;

    let previewImages = [];
    let sourceFileUrl = "";

    if (req.files?.previewImages) {
      previewImages = req.files.previewImages.map(
        (file) => file.path || `/uploads/${file.filename}`
      );
    }

    if (req.files?.sourceFile && req.files.sourceFile.length > 0) {
      const file = req.files.sourceFile[0];
      sourceFileUrl = file.path || `/uploads/${file.filename}`;
    }

    if (!sourceFileUrl) {
      return res.status(400).json({ message: "Template source ZIP file is required" });
    }

    const parsedPrice = isFree === "true" || isFree === true ? 0 : Number(price) || 0;

    const template = await Template.create({
      sellerId,
      title,
      description,
      category,
      price: parsedPrice,
      isFree: parsedPrice === 0,
      previewImages,
      livePreviewUrl: livePreviewUrl || "",
      sourceFileUrl,
      features: typeof features === "string" ? JSON.parse(features) : features || [],
      techStack: typeof techStack === "string" ? JSON.parse(techStack) : techStack || [],
      compatibility: compatibility || "All Modern Browsers",
      license: license || "personal",
      tags: typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags || [],
      status: "pending",
    });

    res.status(201).json({
      message: "Template submitted successfully! Pending admin approval.",
      template,
    });
  } catch (err) {
    console.error("❌ Error creating template:", err);
    res.status(500).json({ message: "Error creating template", error: err.message });
  }
};

// PUT /api/developer/templates/:id
export const updateTemplate = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { id } = req.params;

    const template = await Template.findOne({ _id: id, sellerId });
    if (!template) {
      return res.status(404).json({ message: "Template not found or access denied" });
    }

    const {
      title,
      description,
      category,
      price,
      isFree,
      livePreviewUrl,
      features,
      techStack,
      compatibility,
      license,
      tags,
    } = req.body;

    let resetToPending = false;

    if (title) template.title = title;
    if (description) template.description = description;
    if (category) template.category = category;
    if (livePreviewUrl !== undefined) template.livePreviewUrl = livePreviewUrl;
    if (compatibility) template.compatibility = compatibility;
    if (license) template.license = license;

    if (price !== undefined) {
      const parsedPrice = isFree === "true" || isFree === true ? 0 : Number(price);
      template.price = parsedPrice;
      template.isFree = parsedPrice === 0;
    }

    if (tags) {
      template.tags = typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;
    }
    if (features) {
      template.features = typeof features === "string" ? JSON.parse(features) : features;
    }
    if (techStack) {
      template.techStack = typeof techStack === "string" ? JSON.parse(techStack) : techStack;
    }

    if (req.files?.previewImages && req.files.previewImages.length > 0) {
      template.previewImages = req.files.previewImages.map(
        (file) => file.path || `/uploads/${file.filename}`
      );
    }

    if (req.files?.sourceFile && req.files.sourceFile.length > 0) {
      const file = req.files.sourceFile[0];
      template.sourceFileUrl = file.path || `/uploads/${file.filename}`;
      resetToPending = true;
    }

    if (resetToPending) {
      template.status = "pending";
      template.rejectionReason = "";
    }

    await template.save();

    res.status(200).json({
      message: resetToPending
        ? "Template updated and resubmitted for admin approval."
        : "Template updated successfully.",
      template,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating template", error: err.message });
  }
};

// DELETE /api/developer/templates/:id (Soft delete)
export const deleteTemplate = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { id } = req.params;

    const template = await Template.findOne({ _id: id, sellerId });
    if (!template) {
      return res.status(404).json({ message: "Template not found or access denied" });
    }

    template.status = "archived";
    await template.save();

    res.status(200).json({ message: "Template archived successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting template", error: err.message });
  }
};

// GET /api/developer/analytics
export const getAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const templates = await Template.find({ sellerId, status: { $ne: "archived" } });

    const templatePerformance = templates.map((t) => ({
      id: t._id,
      title: t.title,
      sales: t.purchaseCount,
      downloads: t.downloadCount,
      revenue: t.purchaseCount * t.price,
      rating: t.averageRating,
    }));

    // Mock 30-day timeline graph dataset
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toISOString().split("T")[0],
        sales: Math.floor(Math.random() * 5),
        revenue: Math.floor(Math.random() * 150),
      };
    });

    res.status(200).json({
      templatePerformance,
      salesTimeline: last30Days,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics", error: err.message });
  }
};

// GET /api/developer/earnings
export const getEarnings = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const developer = await Developer.findOne({ userId: sellerId });
    const payouts = await Payout.find({ developerId: sellerId }).sort({ createdAt: -1 });

    const totalEarnings = developer?.totalEarnings || 0;
    const pendingPayouts = payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      totalEarnings,
      pendingPayouts,
      availableBalance: Math.max(0, totalEarnings - pendingPayouts),
      payoutHistory: payouts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching earnings", error: err.message });
  }
};

// POST /api/developer/payout-request
export const requestPayout = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { amount, payoutMethod, accountDetails } = req.body;

    const requestedAmount = Number(amount);
    if (!requestedAmount || requestedAmount < 50) {
      return res.status(400).json({ message: "Minimum payout threshold is $50" });
    }

    const developer = await Developer.findOne({ userId: sellerId });
    if (!developer) {
      return res.status(404).json({ message: "Developer profile not found" });
    }

    const existingPayouts = await Payout.find({ developerId: sellerId });
    const pendingSum = existingPayouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = developer.totalEarnings - pendingSum;
    if (requestedAmount > availableBalance) {
      return res.status(400).json({
        message: `Insufficient available balance. Max requestable: $${availableBalance}`,
      });
    }

    const payout = await Payout.create({
      developerId: sellerId,
      storeName: developer.storeName,
      amount: requestedAmount,
      payoutMethod: payoutMethod || "bank_transfer",
      accountDetails: accountDetails || "",
      status: "pending",
    });

    res.status(201).json({
      message: "Payout request submitted successfully! Awaiting admin processing.",
      payout,
    });
  } catch (err) {
    res.status(500).json({ message: "Error processing payout request", error: err.message });
  }
};

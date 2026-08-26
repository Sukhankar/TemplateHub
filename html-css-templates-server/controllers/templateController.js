import Template from "../models/Template.js";
import Developer from "../models/DeveloperModel.js";

// GET /api/templates (PUBLIC MARKETPLACE)
export const getAllTemplates = async (req, res) => {
  try {
    const {
      q,
      category,
      techStack,
      isFree,
      minPrice,
      maxPrice,
      minRating,
      sort = "newest",
      page = 1,
      limit = 12,
      includeAll,
    } = req.query;

    const query = {};

    // Public API strictly returns approved templates (unless admin flag set)
    if (includeAll !== "true") {
      query.status = "approved";
    }

    // Search term matching title, description, or tags
    if (q) {
      const searchRegex = new RegExp(q, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Tech Stack filter
    if (techStack) {
      const stacks = Array.isArray(techStack)
        ? techStack
        : techStack.split(",").map((s) => s.trim());
      query.techStack = { $in: stacks };
    }

    // Free vs Paid filter
    if (isFree === "true" || isFree === true) {
      query.price = 0;
    } else if (isFree === "false" || isFree === false) {
      query.price = { $gt: 0 };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = query.price || {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === "popular") sortOptions = { downloadCount: -1, purchaseCount: -1 };
    else if (sort === "price-low") sortOptions = { price: 1 };
    else if (sort === "price-high") sortOptions = { price: -1 };
    else if (sort === "rating") sortOptions = { averageRating: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [templates, total] = await Promise.all([
      Template.find(query)
        .populate("sellerId", "name profilePicture")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Template.countDocuments(query),
    ]);

    // Available categories and tech stack tags for filter sidebar
    const categories = [
      "landing-page",
      "portfolio",
      "ecommerce",
      "blog",
      "dashboard",
      "other",
    ];

    const availableTechStacks = [
      "React",
      "Vite",
      "TailwindCSS",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Vue",
      "Next.js",
    ];

    res.status(200).json({
      templates,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      categories,
      availableTechStacks,
    });
  } catch (error) {
    console.error("❌ Error fetching marketplace templates:", error);
    res.status(500).json({ message: "Failed to load templates", error: error.message });
  }
};

// GET /api/templates/featured
export const getFeaturedTemplates = async (req, res) => {
  try {
    const featuredTemplates = await Template.find({ featured: true, status: "approved" })
      .populate("sellerId", "name profilePicture")
      .limit(6);
    res.json(featuredTemplates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/templates/:id
export const getTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    ).populate("sellerId", "name email profilePicture bio socialLinks");

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Fetch seller store info if available
    let developerStore = null;
    if (template.sellerId?._id) {
      developerStore = await Developer.findOne({ userId: template.sellerId._id });
    }

    // Fetch related templates in same category
    const relatedTemplates = await Template.find({
      category: template.category,
      _id: { $ne: template._id },
      status: "approved",
    }).limit(4);

    res.json({
      template,
      developerStore,
      relatedTemplates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/templates (ADMIN)
export const addTemplate = async (req, res) => {
  try {
    const newTemplate = new Template({
      ...req.body,
      sellerId: req.user._id,
      status: "approved",
    });
    await newTemplate.save();
    res.json(newTemplate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/templates/:id (ADMIN)
export const updateTemplate = async (req, res) => {
  try {
    const updated = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/templates/:id (ADMIN)
export const deleteTemplate = async (req, res) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/templates/:id/like
export const likeTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Template.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Template not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

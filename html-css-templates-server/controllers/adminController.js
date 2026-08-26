import User from "../models/userModel.js";
import Developer from "../models/DeveloperModel.js";
import Template from "../models/Template.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import AuditLog from "../models/AuditLog.js";

// Helper log audit
const logAudit = async (adminId, action, targetModel, targetId, details, ip) => {
  try {
    await AuditLog.create({ admin: adminId, action, targetModel, targetId, details, ip });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};

// GET /api/admin/analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDevelopers = await Developer.countDocuments({ isApproved: true });
    const pendingDevelopers = await Developer.countDocuments({ isApproved: false });

    const totalTemplates = await Template.countDocuments();
    const pendingTemplates = await Template.countDocuments({ status: "pending" });
    const approvedTemplates = await Template.countDocuments({ status: "approved" });

    const flaggedReviews = await Review.countDocuments({ status: "flagged" });

    // Financial aggregates
    const ordersStats = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          platformFees: { $sum: "$platformFee" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    const financial = ordersStats[0] || { totalRevenue: 0, platformFees: 0, totalSales: 0 };

    res.status(200).json({
      totalUsers,
      totalDevelopers,
      pendingDevelopers,
      totalTemplates,
      pendingTemplates,
      approvedTemplates,
      flaggedReviews,
      totalRevenue: financial.totalRevenue,
      platformFees: financial.platformFees,
      totalSales: financial.totalSales,
    });
  } catch (error) {
    console.error("❌ Admin analytics error:", error);
    res.status(500).json({ message: "Failed to fetch admin analytics" });
  }
};

// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ users, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:id/ban
export const toggleBanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    await logAudit(
      req.user._id,
      user.isActive ? "UNBAN_USER" : "BAN_USER",
      "User",
      id,
      { email: user.email },
      req.ip
    );

    res.status(200).json({
      message: `User ${user.email} has been ${user.isActive ? "unbanned" : "banned"}.`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/developers
export const getDevelopers = async (req, res) => {
  try {
    const developers = await Developer.find()
      .populate("userId", "name email profilePicture createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/developers/:id/approve
export const approveDeveloper = async (req, res) => {
  try {
    const developer = await Developer.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!developer) return res.status(404).json({ message: "Developer profile not found" });

    // Update user role to developer
    await User.findByIdAndUpdate(developer.userId, { role: "developer" });

    await logAudit(req.user._id, "APPROVE_DEVELOPER", "Developer", req.params.id, {}, req.ip);

    res.status(200).json({ message: "Developer approved successfully", developer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/developers/:id/reject
export const rejectDeveloper = async (req, res) => {
  try {
    const developer = await Developer.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );

    await logAudit(req.user._id, "REJECT_DEVELOPER", "Developer", req.params.id, {}, req.ip);

    res.status(200).json({ message: "Developer application rejected", developer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/templates
export const getAdminTemplates = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== "all") query.status = status;
    if (category) query.category = category;

    const total = await Template.countDocuments(query);
    const templates = await Template.find(query)
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ templates, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/templates/:id/approve
export const approveTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { status: "approved", rejectionReason: "" },
      { new: true }
    );

    if (!template) return res.status(404).json({ message: "Template not found" });

    await logAudit(req.user._id, "APPROVE_TEMPLATE", "Template", req.params.id, { title: template.title }, req.ip);

    res.status(200).json({ message: "Template approved and published to marketplace!", template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/templates/:id/reject
export const rejectTemplate = async (req, res) => {
  try {
    const { rejectionReason = "Does not meet platform quality standards" } = req.body;
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionReason },
      { new: true }
    );

    if (!template) return res.status(404).json({ message: "Template not found" });

    await logAudit(req.user._id, "REJECT_TEMPLATE", "Template", req.params.id, { rejectionReason }, req.ip);

    res.status(200).json({ message: "Template rejected", template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/orders
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("items.template", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

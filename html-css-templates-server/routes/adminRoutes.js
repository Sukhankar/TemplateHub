import express from "express";
import {
  getDashboardAnalytics,
  getUsers,
  toggleBanUser,
  getDevelopers,
  approveDeveloper,
  rejectDeveloper,
  getAdminTemplates,
  approveTemplate,
  rejectTemplate,
  getAdminOrders,
} from "../controllers/adminController.js";
import { protect } from "../middleware/UserAuthMiddleware.js";
import { requireRole } from "../middleware/RoleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(requireRole("admin"));

// Analytics
router.get("/analytics", getDashboardAnalytics);

// User Moderation
router.get("/users", getUsers);
router.put("/users/:id/ban", toggleBanUser);

// Developer Approvals
router.get("/developers", getDevelopers);
router.put("/developers/:id/approve", approveDeveloper);
router.put("/developers/:id/reject", rejectDeveloper);

// Template Moderation
router.get("/templates", getAdminTemplates);
router.put("/templates/:id/approve", approveTemplate);
router.put("/templates/:id/reject", rejectTemplate);

// Orders & Finance
router.get("/orders", getAdminOrders);

export default router;

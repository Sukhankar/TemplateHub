import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getDashboard,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getAnalytics,
  getEarnings,
  requestPayout,
} from "../controllers/developerController.js";

import { protect } from "../middleware/UserAuthMiddleware.js";
import { requireRole } from "../middleware/RoleMiddleware.js";
import { validateUploadedFiles } from "../middleware/fileValidationMiddleware.js";

const router = express.Router();

// Configure local Multer storage
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
});

const templateUploads = upload.fields([
  { name: "previewImages", maxCount: 5 },
  { name: "sourceFile", maxCount: 1 },
]);

// Apply Auth and Role Check to ALL Developer Routes
router.use(protect);
router.use(requireRole("developer", "admin"));

// Routes
router.get("/dashboard", getDashboard);
router.get("/templates", getTemplates);
router.post("/templates", templateUploads, validateUploadedFiles, createTemplate);
router.put("/templates/:id", templateUploads, validateUploadedFiles, updateTemplate);
router.delete("/templates/:id", deleteTemplate);

router.get("/analytics", getAnalytics);
router.get("/earnings", getEarnings);
router.post("/payout-request", requestPayout);

export default router;

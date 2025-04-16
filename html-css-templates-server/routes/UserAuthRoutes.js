import express from "express";
import { login, signup, getMe } from "../controllers/UserAuthController.js";
import { protect } from "../middleware/UserAuthMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;

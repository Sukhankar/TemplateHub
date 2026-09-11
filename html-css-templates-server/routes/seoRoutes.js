import express from "express";
import { getSitemapXML, getRobotsTXT, getTemplateSchema } from "../controllers/seoController.js";

const router = express.Router();

router.get("/sitemap.xml", getSitemapXML);
router.get("/robots.txt", getRobotsTXT);
router.get("/schema/template/:id", getTemplateSchema);

export default router;

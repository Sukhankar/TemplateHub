import express from 'express';
import { login, createAdmin } from '../controllers/AdminauthController.js';

const router = express.Router();

router.post('/login', login);
router.post('/create', createAdmin); // Remove later for security

export default router;

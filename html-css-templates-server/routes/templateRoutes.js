import express from 'express';
import {
  getAllTemplates,
  getFeaturedTemplates,
  getTemplate,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  likeTemplate
} from '../controllers/templateController.js';

import { authenticateAdmin } from '../middleware/AdminAuthMiddleware.js';

const router = express.Router();

router.get('/', getAllTemplates);
router.get('/featured', getFeaturedTemplates);
router.get('/:id', getTemplate);
router.post('/', authenticateAdmin, addTemplate);
router.put('/:id', authenticateAdmin, updateTemplate);
router.delete('/:id', authenticateAdmin, deleteTemplate);
router.patch('/:id/like', likeTemplate);

export default router;

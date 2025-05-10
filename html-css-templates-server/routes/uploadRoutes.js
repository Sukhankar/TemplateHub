import express from 'express';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Normalize the file path for compatibility
  const normalizedPath = req.file.path.replace(/\\/g, '/');
  const fileUrl = `/${normalizedPath}`;
  res.status(200).json({ url: fileUrl });
});

export default router;

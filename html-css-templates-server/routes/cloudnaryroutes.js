// routes/uploadRoutes.js
import express from 'express';
import { upload } from '../middleware/cloudnary.js';

const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(200).json({
    url: req.file.path,  // This is the Cloudinary URL
    public_id: req.file.filename // Store this if you plan to delete later
  });
});

export default router;

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads folder if it doesn't exist
const createUploadFolders = () => {
  const folders = ['uploads/images'];
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
};
createUploadFolders();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
  
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  };  

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

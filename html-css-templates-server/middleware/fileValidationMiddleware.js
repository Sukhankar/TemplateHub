import AdmZip from "adm-zip";
import fs from "fs";

// Magic bytes definitions
const MAGIC_BYTES = {
  zip: [0x50, 0x4b, 0x03, 0x04],
  png: [0x89, 0x50, 0x4e, 0x47],
  jpeg: [0xff, 0xd8, 0xff],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF header
};

const FORBIDDEN_EXTENSIONS = [
  ".exe",
  ".sh",
  ".php",
  ".py",
  ".bat",
  ".cmd",
  ".vbs",
  ".ps1",
  ".jar",
  ".cgi",
  ".pl",
];

export const validateUploadedFiles = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files) {
      return next();
    }

    // Process sourceFile ZIP upload
    if (files.sourceFile && files.sourceFile.length > 0) {
      const zipFile = files.sourceFile[0];
      const filePath = zipFile.path;

      // 1. Validate ZIP magic bytes
      const buffer = Buffer.alloc(4);
      const fd = fs.openSync(filePath, "r");
      fs.readSync(fd, buffer, 0, 4, 0);
      fs.closeSync(fd);

      const isZipMagic = MAGIC_BYTES.zip.every((byte, i) => buffer[i] === byte);
      if (!isZipMagic) {
        fs.unlinkSync(filePath); // Delete invalid file
        return res.status(400).json({
          message: "Security error: Uploaded source file is not a valid ZIP archive.",
        });
      }

      // 2. Scan ZIP contents using adm-zip
      try {
        const zip = new AdmZip(filePath);
        const zipEntries = zip.getEntries();

        for (const entry of zipEntries) {
          const entryName = entry.entryName.toLowerCase();
          const isForbidden = FORBIDDEN_EXTENSIONS.some((ext) => entryName.endsWith(ext));

          if (isForbidden) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
              message: `Security violation: ZIP archive contains forbidden executable file [${entry.entryName}]`,
            });
          }
        }
      } catch (zipErr) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({
          message: "Corrupted or unreadable ZIP archive.",
        });
      }
    }

    // Process previewImages
    if (files.previewImages && files.previewImages.length > 0) {
      for (const imgFile of files.previewImages) {
        const filePath = imgFile.path;
        const buffer = Buffer.alloc(4);
        const fd = fs.openSync(filePath, "r");
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);

        const isPng = MAGIC_BYTES.png.every((b, i) => buffer[i] === b);
        const isJpeg = MAGIC_BYTES.jpeg.every((b, i) => buffer[i] === b);
        const isWebp = MAGIC_BYTES.webp.every((b, i) => buffer[i] === b);

        if (!isPng && !isJpeg && !isWebp) {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          return res.status(400).json({
            message: `Security error: Uploaded preview image [${imgFile.originalname}] is not a valid PNG/JPEG/WebP file.`,
          });
        }
      }
    }

    next();
  } catch (err) {
    console.error("❌ File validation error:", err);
    res.status(500).json({ message: "File validation failed", error: err.message });
  }
};

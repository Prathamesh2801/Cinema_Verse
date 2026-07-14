import multer from "multer";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

// Keep the file in memory — we stream the buffer straight to Cloudinary, so
// nothing ever touches Render's (ephemeral) filesystem.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPEG, PNG, or WEBP images are allowed"));
  },
});

// Wraps multer so its errors become clean 400s instead of crashing the request.
export function singleImage(field) {
  return (req, res, next) => {
    upload.single(field)(req, res, (err) => {
      if (err) {
        const message =
          err.code === "LIMIT_FILE_SIZE"
            ? "Image must be 5 MB or smaller"
            : err.message || "Upload failed";
        return res.status(400).json({ message });
      }
      next();
    });
  };
}

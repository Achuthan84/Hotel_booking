import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 4, fileSize: 10 * 1024 * 1024 },
});

export default upload;
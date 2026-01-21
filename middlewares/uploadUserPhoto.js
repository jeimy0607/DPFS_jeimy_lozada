const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/uploads/users")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `user-${Date.now()}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new Error("Solo se permiten imágenes"));
}

const uploadUserPhoto = multer({ storage, fileFilter });

module.exports = uploadUserPhoto;

const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowExt = [".pdf", ".jpg", ".jpeg", ".png"];

  if (allowExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed!"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "serviceUploadsImg/");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    const uniqueName = Date.now() + "-" + safeName;
    cb(null, uniqueName);
  },
});

const serviceUpload = multer({
  fileFilter,
  storage,
  limits: { fileSize: 5 * 1000 * 1000 },
});

module.exports = serviceUpload;

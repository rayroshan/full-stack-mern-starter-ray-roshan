const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const { v1: uuidv1 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "video/mov": "mov",
};

const fileUpload = multer({
  limit: 5000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      let fileName = uuidv1() + "." + ext;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;

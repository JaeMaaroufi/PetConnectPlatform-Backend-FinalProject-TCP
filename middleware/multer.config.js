const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-";
    const filename = uniqueSuffix + file.originalname;
    cb(null, filename);
  },
});

const fileFilterFn = (req, file, cb) => {
  const filetypes = /jpeg|png|jpg|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: File upload only supports the following filetypes - " + filetypes);
};

const fileUpload = multer({ storage: storage, fileFilter: fileFilterFn });

module.exports = fileUpload;

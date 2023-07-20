const multer = require("multer");

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "./tmp");
  // },
  filename: function (req, file, cb) {
    const uniq = Date.now() + Math.round(Math.random() * 1e9);
    cb(null, uniq + ".png");
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * Math.pow(1024, 4) },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image.jfif') {
        cb(null, true);
        req.isFileValid = true
    } else {
        req.isFileValid = false
        req.isFileValidMessage = 'Only PNG / JPG / JPEG images are allowed'
        return cb(null, false);
    }
    },
});

module.exports = {upload};

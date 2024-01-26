const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatar", (err, success) => {
      if (err) throw err;
    });
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, (err, success) => {
      if (err) throw err;
    });
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

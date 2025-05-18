const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = './uploads/others';

    if (file.fieldname === 'preview') {
      dir = './uploads/preview';
    } else if (file.fieldname === 'gallery') {
      dir = './uploads/gallery';
    }

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;

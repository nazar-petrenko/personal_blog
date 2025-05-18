const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
  // Дозволені лише зображення
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Тільки зображення!'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимум
  },
  fileFilter
});

module.exports = upload;

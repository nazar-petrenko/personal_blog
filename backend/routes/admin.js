const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/articles',
  auth,
  checkRole('admin'),
  upload.fields([
    { name: 'preview', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  adminController.createArticle
);

router.put('/articles/:id', auth, checkRole('admin'), adminController.updateArticle);
router.delete('/articles/:id', auth, checkRole('admin'), adminController.deleteArticle);

module.exports = router;
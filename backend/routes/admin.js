const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

router.post('/articles', auth, checkRole('admin'), adminController.createArticle);
router.put('/articles/:id', auth, checkRole('admin'), adminController.updateArticle);
router.delete('/articles/:id', auth, checkRole('admin'), adminController.deleteArticle);

module.exports = router;
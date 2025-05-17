const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');

// Публічні роути
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);

// Захищені
router.post('/', authMiddleware, articleController.createArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);

module.exports = router;

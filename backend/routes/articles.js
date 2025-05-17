const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const likeController = require('../controllers/likeController');
// Публічні роути
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.get('/:articleId/isLiked', authMiddleware, likeController.isLiked);

// Захищені
router.post('/', authMiddleware, articleController.createArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);

module.exports = router;

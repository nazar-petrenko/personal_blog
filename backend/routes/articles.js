const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const likeController = require('../controllers/likeController');
const multer = require('multer');
const path = require('path');

// Публічні
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.get('/:articleId/isLiked', authMiddleware, likeController.isLiked);

router.delete('/:id', authMiddleware, articleController.deleteArticle);

module.exports = router;

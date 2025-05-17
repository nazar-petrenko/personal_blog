const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

// Отримати кількість лайків до статті
router.get('/:articleId', likeController.getLikes);

// Лайкнути статтю
router.post('/:articleId', authMiddleware, likeController.likeArticle);

// Прибрати лайк
router.delete('/:articleId', authMiddleware, likeController.unlikeArticle);

router.get('/:articleId/isLiked', authMiddleware, likeController.isLiked);

module.exports = router;

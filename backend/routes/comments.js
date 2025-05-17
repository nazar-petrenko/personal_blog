const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Публічний: отримати всі коментарі до статті
router.get('/:articleId', commentController.getCommentsByArticleId);

// Авторизований: створити коментар
router.post('/:articleId', authMiddleware, commentController.createComment);

// Авторизований: видалити свій коментар або адмін
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;

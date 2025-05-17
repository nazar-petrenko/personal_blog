const db = require('../db');

exports.getCommentsByArticleId = (req, res) => {
  const { articleId } = req.params;

  db.all(
    `SELECT comments.*, users.email AS authorEmail FROM comments
     JOIN users ON comments.user_id = users.id
     WHERE article_id = ?
     ORDER BY created_at DESC`,
    [articleId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
};

exports.createComment = (req, res) => {
  const { content } = req.body;
  const { articleId } = req.params;
  const userId = req.user.id;

  if (!content?.trim()) {
    return res.status(400).json({ message: 'Content required' });
  }

  db.run(
    `INSERT INTO comments (content, article_id, user_id)
     VALUES (?, ?, ?)`,
    [content, articleId, userId],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.deleteComment = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  db.get(`SELECT * FROM comments WHERE id = ?`, [id], (err, comment) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    db.run(`DELETE FROM comments WHERE id = ?`, [id], function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Deleted successfully' });
    });
  });
};

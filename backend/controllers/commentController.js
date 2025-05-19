const db = require('../db');

exports.getCommentsByArticleId = (req, res) => {
  const { articleId } = req.params;

db.all(
  `SELECT comments.id, comments.content, comments.created_at, users.nickname 
   FROM comments 
   LEFT JOIN users ON comments.user_id = users.id 
   WHERE comments.article_id = ?
   ORDER BY comments.created_at DESC`,
  [articleId],
  (err, rows) => {
    if (err) {
      console.error(" DB error in getCommentsByArticleId:", err); // додано
      return res.status(500).json({ message: 'DB error' });
    }
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

    db.get(
      `SELECT comments.id, comments.content, comments.created_at, users.nickname 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE comments.id = ?`,
      [this.lastID],
      (err, newComment) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        res.status(201).json(newComment);
      }
    );
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

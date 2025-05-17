const db = require('../db');

exports.getLikes = (req, res) => {
  const { articleId } = req.params;

  db.get(
    `SELECT COUNT(*) AS count FROM likes WHERE article_id = ?`,
    [articleId],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ likes: row.count });
    }
  );
};

exports.likeArticle = (req, res) => {
  const { articleId } = req.params;
  const userId = req.user.id;

  db.run(
    `INSERT OR IGNORE INTO likes (user_id, article_id) VALUES (?, ?)`,
    [userId, articleId],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });

      if (this.changes === 0) {
        return res.status(200).json({ message: 'Already liked' });
      }

      res.status(201).json({ message: 'Liked' });
    }
  );
};

exports.unlikeArticle = (req, res) => {
  const { articleId } = req.params;
  const userId = req.user.id;

  db.run(
    `DELETE FROM likes WHERE user_id = ? AND article_id = ?`,
    [userId, articleId],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Like not found' });
      }

      res.json({ message: 'Unliked' });
    }
  );
};

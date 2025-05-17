const db = require('../db');

exports.createArticle = (req, res) => {
  const { title, content, language } = req.body;
  const author_id = req.user.id;

  db.run(
    `INSERT INTO articles (title, content, language, author_id) VALUES (?, ?, ?, ?)`,
    [title, content, language || 'en', author_id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.updateArticle = (req, res) => {
  const { id } = req.params;
  const { title, content, language } = req.body;

  db.run(
    `UPDATE articles SET title = ?, content = ?, language = ? WHERE id = ?`,
    [title, content, language, id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Article updated' });
    }
  );
};

exports.deleteArticle = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM articles WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ message: 'Article deleted' });
  });
};

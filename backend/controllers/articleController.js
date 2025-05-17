const db = require('../db');

exports.getAllArticles = (req, res) => {
  const lang = req.query.lang || 'en';
  db.all(`SELECT * FROM articles WHERE language = ? ORDER BY created_at DESC`, [lang], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
};

exports.getArticleById = (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM articles WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Article not found' });
    res.json(row);
  });
};

exports.createArticle = (req, res) => {
  const { title, content, language } = req.body;
  const author_id = req.user.id;

  db.run(`
    INSERT INTO articles (title, content, language, author_id)
    VALUES (?, ?, ?, ?)`,
    [title, content, language || 'en', author_id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Спочатку перевірити, чи користувач є автором
  db.get(`SELECT * FROM articles WHERE id = ?`, [id], (err, article) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!article) return res.status(404).json({ message: 'Not found' });
    if (article.author_id !== userId) return res.status(403).json({ message: 'Forbidden' });

    db.run(`DELETE FROM articles WHERE id = ?`, [id], function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Deleted successfully' });
    });
  });
};

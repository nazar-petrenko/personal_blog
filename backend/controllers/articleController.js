const db = require('../db');

exports.getAllArticles = (req, res) => {
  try {

  } catch (err) {
  console.error("Failed to fetch articles", err.response?.data || err.message);
  }
  const lang = req.query.lang;
  const params = [];

  let sql = `
    SELECT 
      articles.*,
      (
        SELECT COUNT(*) 
        FROM likes 
        WHERE likes.article_id = articles.id
      ) AS likeCount
    FROM articles
  `;

  if (lang && lang !== 'all') {
    sql += ` WHERE articles.language = ?`;
    params.push(lang);
  }

  sql += ` ORDER BY articles.created_at DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("DB error:", err); // 👈 додай лог для діагностики
      return res.status(500).json({ message: 'DB error' });
    }
    res.json(rows);
  });
};


exports.getArticleById = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM articles WHERE id = ?`, [id], (err, article) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Отримати зображення
    db.all(`SELECT path FROM article_images WHERE article_id = ?`, [id], (err, images) => {
      if (err) return res.status(500).json({ message: 'DB error (images)' });

      // Додаємо images[] до об'єкта article
      article.images = images.map(img => img.path);
      res.json(article);
    });
  });
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

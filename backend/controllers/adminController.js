const db = require('../db');

exports.createArticle = (req, res) => {
  const { title, content, language } = req.body;
  const author_id = req.user.id;

  const preview = req.files?.preview?.[0]?.filename
    ? `/uploads/preview/${req.files.preview[0].filename}`
    : null;

  const galleryFiles = req.files?.gallery || [];

  db.run(
    `INSERT INTO articles (title, content, language, author_id, preview_image) VALUES (?, ?, ?, ?, ?)`,
    [title, content, language || 'en', author_id, preview],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error (article)' });

      const articleId = this.lastID;

      const insertGallery = db.prepare(`INSERT INTO article_images (article_id, path) VALUES (?, ?)`);
      galleryFiles.forEach(file => {
        insertGallery.run(articleId, `/uploads/gallery/${file.filename}`);
      });
      insertGallery.finalize();

      res.status(201).json({ message: 'Article created', articleId });
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

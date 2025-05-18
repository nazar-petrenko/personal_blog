const db = require('../db');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder,
      transformation: [
        { width: 1280, height: 1280, crop: "limit" },
        { fetch_format: "auto", quality: "auto" }
      ]
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createArticle = async (req, res) => {
  const { title, content, language } = req.body;
  const author_id = req.user.id;

  try {
    let previewUrl = null;
    if (req.files?.preview?.[0]) {
      const result = await uploadToCloudinary(req.files.preview[0].buffer, 'blog_preview');
      previewUrl = result.secure_url;
    }

    const galleryUrls = [];
    if (req.files?.gallery?.length) {
      for (const file of req.files.gallery) {
        const result = await uploadToCloudinary(file.buffer, 'blog_gallery');
        galleryUrls.push(result.secure_url);
      }
    }

    db.run(
      `INSERT INTO articles (title, content, language, author_id, preview_image) VALUES (?, ?, ?, ?, ?)`,
      [title, content, language || 'en', author_id, previewUrl],
      function (err) {
        if (err) return res.status(500).json({ message: 'DB error (article)' });

        const articleId = this.lastID;

        const insertGallery = db.prepare(`INSERT INTO article_images (article_id, path) VALUES (?, ?)`);
        galleryUrls.forEach(url => {
          insertGallery.run(articleId, url);
        });
        insertGallery.finalize();

        res.status(201).json({ message: 'Article created', articleId });
      }
    );
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ message: 'Upload error' });
  }
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


function extractPublicId(url) {
  try {
    const parts = url.split('/');
    const versionIndex = parts.findIndex(p => /^v\d+$/.test(p));
    const publicIdParts = parts.slice(versionIndex + 1); // після v1716580840
    const lastPart = publicIdParts.join('/').split('.')[0]; // без .jpg
    return lastPart; // -> blog_preview/abcd1234
  } catch (e) {
    console.warn("❌ extractPublicId failed for URL:", url);
    return null;
  }
}

exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Отримати всі медіа
    const images = await new Promise((resolve, reject) => {
      db.all(`SELECT path FROM article_images WHERE article_id = ?`, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    // 2. Видалити з Cloudinary
    const deleteGalleryPromises = images.map(image => {
      const publicId = extractPublicId(image.path);
      console.log("🧨 Trying to delete:", publicId);
      if (publicId) {
        return cloudinary.uploader.destroy(publicId)
          .then(() => console.log("✅ Gallery image deleted:", publicId))
          .catch(err => console.warn("❌ Gallery delete error:", err.message));
      }
    });

    // 3. Видалити прев’ю
    const previewImage = await new Promise((resolve, reject) => {
      db.get(`SELECT preview_image FROM articles WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row?.preview_image);
      });
    });

    if (previewImage) {
      const publicId = extractPublicId(previewImage);
      if (publicId) {
        deleteGalleryPromises.push(
          cloudinary.uploader.destroy(publicId)
            .then(() => console.log("✅ Preview image deleted:", publicId))
            .catch(err => console.warn("❌ Preview delete error:", err.message))
        );
      }
    }

    await Promise.all(deleteGalleryPromises); // чекаємо ВСІ видалення

    // 4. Видалити з БД
    db.serialize(() => {
      db.run(`DELETE FROM article_images WHERE article_id = ?`, [id]);
      db.run(`DELETE FROM comments WHERE article_id = ?`, [id]);
      db.run(`DELETE FROM likes WHERE article_id = ?`, [id]);
      db.run(`DELETE FROM articles WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ message: 'DB error (delete)' });
        res.json({ message: 'Article and related data deleted' });
      });
    });
  } catch (err) {
    console.error("❌ Failed to delete article:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

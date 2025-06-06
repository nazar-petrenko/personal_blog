const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');


const db = new sqlite3.Database(path.join(__dirname, '../blog.db'), (err) => {
  if (err) {
    console.error('❌ DB Error:', err);
  } else {
    console.log('✅ SQLite DB connected');
  }
});

// --- Створення таблиць, якщо не існують ---

db.serialize(() => {
  // Users
   db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Articles (з preview_image)
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      language TEXT DEFAULT 'en',
      preview_image TEXT,
      author_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `);

  // Article Images (галерея до кожної статті)
  db.run(`
    CREATE TABLE IF NOT EXISTS article_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      path TEXT NOT NULL, -- шлях до зображення
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id)
    )
  `);

  // Comments
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      article_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Likes
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(article_id, user_id),
      FOREIGN KEY (article_id) REFERENCES articles(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);


const admins = [
    {
      email: process.env.ADMIN1_EMAIL,
      password: process.env.ADMIN1_PASSWORD,
      nickname: 'admin',
    },
    {
      email: process.env.ADMIN2_EMAIL,
      password: process.env.ADMIN2_PASSWORD,
      nickname: 'adminSec',
    },
  ];

  admins.forEach(({ email, password, nickname }) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
      if (err) {
        console.error(`❌ Error checking user ${email}:`, err);
      } else if (!row) {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          `INSERT INTO users (email, password, nickname, role) VALUES (?, ?, ?, ?)`,
          [email, hashedPassword, nickname, 'admin'],
          (err) => {
            if (err) {
              console.error(`❌ Failed to create admin ${email}:`, err);
            } else {
              console.log(`✅ Admin created: ${email}`);
            }
          }
        );
      } else {
        console.log(`ℹ️ Admin already exists: ${email}`);
      }
    });
  });
});

module.exports = db;

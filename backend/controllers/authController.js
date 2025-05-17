const db = require('../db');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { email, password, nickname } = req.body;

  // Basic validation
  const errors = [];
  if (!email || !email.includes('@')) errors.push('Некоректна пошта');
  if (!password || password.length < 8 || !/[A-Z]/.test(password)) {
    errors.push('Пароль повинен містити мінімум 8 символів і хоча б одну велику літеру');
  }
  if (!nickname || nickname.length < 3) errors.push('Нікнейм повинен містити мінімум 3 символи');

  if (errors.length > 0) return res.status(400).json({ message: errors.join(', ') });

  // Check if email or nickname already exists
  db.get(`SELECT * FROM users WHERE email = ? OR nickname = ?`, [email, nickname], (err, existing) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (existing) return res.status(409).json({ message: 'Така пошта або нікнейм вже існує' });

    const hash = bcrypt.hashSync(password, 10);

    db.run(
      `INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)`,
      [email, hash, nickname],
      function (err) {
        if (err) return res.status(500).json({ message: 'DB error' });

        const user = { id: this.lastID, role: 'user', email, nickname };
        const { accessToken, refreshToken } = generateTokens(user);

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken, user });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const safeUser = {
      id: user.id,
      role: user.role,
      email: user.email,
      nickname: user.nickname
    };
    const { accessToken, refreshToken } = generateTokens(safeUser);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: safeUser });
  });
};

exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const user = { id: decoded.id, role: decoded.role };
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ accessToken });
  });
};
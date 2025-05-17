const db = require('../db');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hash], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });

    const user = { id: this.lastID, role: 'user', email };
    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,         // використовуй HTTPS у проді
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    });

    res.json({ accessToken, user });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const safeUser = { id: user.id, role: user.role, email: user.email };
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
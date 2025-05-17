const db = require('../db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

exports.register = (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hash], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    const token = generateToken({ id: this.lastID, role: 'user' });
    res.json({ token });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token });
  });
};

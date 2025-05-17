const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./db'); // база


app.use(cors({
  origin: '*', // або '*' якщо хочеш дозволити всім (не рекомендується для продакшену)
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // якщо потрібні куки/credentials
}));
app.use(express.json());


// Роути
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/comments', require('./routes/comments'));

// 404 fallback
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

module.exports = app;
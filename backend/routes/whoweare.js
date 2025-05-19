const express = require('express');
const router = express.Router();
const { getWhoWeAreImages } = require('../controllers/whoWeAreController');

router.get('/images', getWhoWeAreImages);

module.exports = router;

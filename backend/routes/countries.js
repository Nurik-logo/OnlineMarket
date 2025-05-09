const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

router.get('/', async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

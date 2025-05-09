const express = require('express');
const router = express.Router();
const StoreCategory = require('../models/StoreCategory');

router.get('/', async (req, res) => {
  try {
    const categories = await StoreCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Store categories fetch error:', error);
    res.status(500).json({ message: 'Санаттарды алу кезінде қате шықты' });
  }
});

module.exports = router;

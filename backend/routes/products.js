const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { checkToken } = require('../middleware/authentication');

router.post('/', checkToken, async (req, res) => {
    const { name, short_description, image_url, price, unit_of_measure, quantity, store_id } = req.body;
  
    if (!name || !short_description || !image_url || !price || !unit_of_measure || !quantity || !store_id) {
      return res.status(400).json({ error: 'Барлық өрістер толтырылуы қажет.' });
    }
  
    try {
      const product = await Product.addProduct({
        name,
        short_description,
        image_url,
        price,
        unit_of_measure,
        quantity,
        store_id
      });
  
      res.status(201).json(product);
    } catch (error) {
      console.error('Product insert error:', error);
      res.status(500).json({ error: 'Сервер қателігі' });
    }
  });

router.get('/store/:storeId', checkToken, async (req, res) => {
  try {
    const products = await Product.findByStoreId(req.params.storeId);
    res.json(products);
  } catch (err) {
    console.error('Product fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/authentication');
const Store = require('../models/Store');

router.post('/', checkToken, async (req, res) => {
  const { region_id, store_category_id, name, description, image_url } = req.body;
  const user_id = req.user.id;

  try {
    const newStore = await Store.create({
      user_id,
      region_id,
      store_category_id,
      name,
      description,
      image_url
    });

    res.status(201).json(newStore);
  } catch (error) {
    console.error('Store creation error:', error);
    res.status(500).json({ message: 'Дүкенді қосу кезінде қате шықты' });
  }
});

router.get('/', checkToken, async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Мұны біріншіден жазыңыз
router.get('/my', checkToken, async (req, res) => {
  try {
    const stores = await Store.findAllWithDetails(req.user.id);
    res.json(stores);
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Мұны кейін жазыңыз
router.get('/:id', checkToken, async (req, res) => {
  const storeId = parseInt(req.params.id, 10);
  if (isNaN(storeId)) {
    return res.status(400).json({ message: 'Invalid store ID' });
  }

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (err) {
    console.error('Error fetching store:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});






module.exports = router;

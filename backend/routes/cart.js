const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { checkToken } = require('../middleware/authentication');

router.post('/add', checkToken, async (req, res) => {
  try {
    const newCartItem = await Cart.add(req.body);
    res.status(201).json(newCartItem);
  } catch (err) {
    console.error('Error adding to cart:', err.message);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.get('/:customerId', checkToken, async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const cartItems = await Cart.findByCustomerId(customerId);
    res.status(200).json(cartItems);
  } catch (err) {
    console.error('Error fetching cart:', err.message);
    res.status(500).json({ error: 'Failed to get cart items' });
  }
});

router.delete('/:id', checkToken, async (req, res) => {
  try {
    const deletedItem = await Cart.deleteById(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(200).json(deletedItem);
  } catch (err) {
    console.error('Error deleting cart item:', err.message);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

module.exports = router;

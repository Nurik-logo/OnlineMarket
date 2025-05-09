const express = require('express');
const router = express.Router();
const CreditCard = require('../models/CreditCard');
const { checkToken } = require('../middleware/authentication');

// @route   GET /creditcards/user/:userId
// @desc    Get all credit cards for a user
// @access  Private
router.get('/user/:userId', checkToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const cards = await CreditCard.findByUserId(userId);
    res.json(cards);
  } catch (err) {
    console.error('Error getting credit cards:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /creditcards
// @desc    Add a new credit card
// @access  Private
router.post('/', checkToken, async (req, res) => {
  const { card_number, expiry_date, cvv, card_type } = req.body;
  const user_id = req.user.id;

  try {
    const newCard = await CreditCard.createCard({
      user_id,
      card_number,
      expiry_date,
      cvv,
      card_type
    });

    res.status(201).json(newCard);
  } catch (err) {
    console.error('Error creating credit card:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

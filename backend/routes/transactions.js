const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); // Transaction моделін импорттаңыз

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.getAll();

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found.' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching transactions.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Balance = require('../models/Balance');
const { checkToken } = require('../middleware/authentication');
const { createTransaction } = require('../models/Transaction');

// @route   GET /balances/:userId
// @desc    Get user's balance
// @access  Private
router.get('/:userId', checkToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const balance = await Balance.getByUserId(userId);

    if (!balance) {
      return res.status(404).json({ message: 'Balance not found' });
    }

    res.json(balance);
  } catch (err) {
    console.error('Error getting balance:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/pay-commission', checkToken, async (req, res) => {
  const { userId, commissionUSD, commissionKZT } = req.body;
  const admin_id = 6;

  try {
    const formattedCommissionUSD = parseFloat(commissionUSD.toFixed(3));
    const userBalance = await Balance.getByUserId(userId);
    if (!userBalance || parseFloat(userBalance.balance) < formattedCommissionUSD) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 1. User балансын азайту
    const newUserBalance = parseFloat((parseFloat(userBalance.balance) - formattedCommissionUSD).toFixed(2));
    await Balance.updateBalance(userId, newUserBalance);

    // 2. Admin балансын көбейту
    const adminBalance = await Balance.getAdminBalance();
    const adminCurrentBalance = parseFloat(adminBalance.balance);
    const newAdminBalance = parseFloat((formattedCommissionUSD + adminCurrentBalance).toFixed(3));
    await Balance.updateAdminBalance(newAdminBalance);

    // 3. Баланстар сәтті жаңарғаннан кейін транзакциялар жазу
    await createTransaction(userId, admin_id, commissionKZT, 'Commission Payment', '5% комиссия теңгемен', false);
    await createTransaction(userId, admin_id, commissionKZT, 'Commission Received', '5% комиссия түсті', true);

    res.status(200).json({ message: 'Commission paid successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing the commission payment' });
  }
});





module.exports = router;

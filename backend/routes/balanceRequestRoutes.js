const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const BalanceRequest = require('../models/BalanceRequest');
const { checkToken } = require('../middleware/authentication');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/receipts';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', checkToken, upload.single('receipt'), async (req, res) => {
    try {
      const { userId, type, amount, phoneNumber } = req.body;
      const receiptPath = req.file ? req.file.path : null;
  
      // Егер сұраныс түрі "withdraw" болса, phoneNumber қажет
      if (type === 'withdraw' && !phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required for withdrawal.' });
      }
  
      // Егер сұраныс түрі "deposit" болса, receipt қажет
      if (type === 'deposit' && !receiptPath) {
        return res.status(400).json({ message: 'Receipt is required for deposit.' });
      }
  
      if (!userId || !type || !amount) {
        return res.status(400).json({ message: 'All fields except receipt or phone number are required.' });
      }
  
      const savedRequest = await BalanceRequest.create({
        userId,
        type,
        amount,
        phoneNumber: type === 'withdraw' ? phoneNumber : null,  // "withdraw" кезінде ғана phoneNumber сақталады
        receipt: type === 'deposit' ? receiptPath : null,        // "deposit" кезінде ғана receipt сақталады
      });
  
      res.status(201).json(savedRequest);
    } catch (error) {
      console.error('Error creating balance request:', error);
      res.status(500).json({ message: 'Server error while processing balance request.' });
    }
  });
  

module.exports = router;

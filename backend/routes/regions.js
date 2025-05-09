const express = require('express');
const router = express.Router();
const Region = require('../models/Region');
const { checkToken } = require('../middleware/authentication');

router.get('/country/:countryId', async (req, res) => {
  const { countryId } = req.params;
  try {
    const regions = await Region.findByCountryId(countryId);
    res.json(regions);
  } catch (error) {
    console.error('Error getting regions:', error);
    res.status(500).json({ message: 'Сервер қатесі' });
  }
});

router.get('/:id', checkToken, async (req, res) => {
  const { id } = req.params;
  try {
    const region = await Region.findNameById(id);
    if (!region) {
      return res.status(404).json({ message: 'Region not found' });
    }
    res.json(region);
  } catch (err) {
    console.error('Error fetching region:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

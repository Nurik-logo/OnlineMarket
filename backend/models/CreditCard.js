const db = require('../db');

const CreditCard = {
  findByUserId: async (userId) => {
    const result = await db.query(
      'SELECT id, card_number, expiry_date, card_type FROM creditcards WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  },

  createCard: async ({ user_id, card_number, expiry_date, cvv, card_type }) => {
    const result = await db.query(
      `INSERT INTO creditcards (user_id, card_number, expiry_date, cvv, card_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, card_number, expiry_date, card_type`,
      [user_id, card_number, expiry_date, cvv, card_type]
    );
    return result.rows[0];
  },

  findById: async (cardId) => {
    const result = await db.query('SELECT * FROM creditcards WHERE id = $1', [cardId]);
    return result.rows[0];
  }
};

module.exports = CreditCard;

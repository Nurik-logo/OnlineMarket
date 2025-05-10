const db = require('../db');

const BalanceRequest = {
  async create({ userId, type, amount, phoneNumber, receipt }) {
    const result = await db.query(
      `INSERT INTO balance_requests 
        (user_id, type, amount, phone_number, receipt, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING *`,
      [userId, type, amount, phoneNumber, receipt]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await db.query('SELECT * FROM balance_requests ORDER BY created_at DESC');
    return result.rows;
  }
};

module.exports = BalanceRequest;

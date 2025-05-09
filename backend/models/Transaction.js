const db = require('../db'); // DB қосылымы

const Transaction = {
  async getAll() {
    const result = await db.query('SELECT * FROM transactions ORDER BY created_at DESC');
    return result.rows;
  },
  async createTransaction(buyerId, sellerId, amount, type, description, isCredit) {
    const result = await db.query(
      `INSERT INTO transactions 
        (buyer_id, seller_id, amount, type, description, is_credit, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [buyerId, sellerId, amount, type, description, isCredit]
    );
    return result.rows[0];
  }
};

module.exports = Transaction;

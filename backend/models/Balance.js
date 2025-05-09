const db = require('../db');

const Balance = {
  // Creates an initial balance entry for a user with a balance of 0
  async createBalance(userId) {
    const result = await db.query(
      'INSERT INTO balances (user_id, balance) VALUES ($1, 0) RETURNING *',
      [userId]
    );
    return result.rows[0];
  },

  // Gets balance for a specific user by their ID
  async getByUserId(userId) {
    const result = await db.query(
      'SELECT * FROM balances WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  },

  // ✅ Updates the balance for a specific user by their ID
  async updateBalance(userId, newBalance) {
    console.log("Updating user balance to:", newBalance, "for userId:", userId);
    const result = await db.query(
      'UPDATE balances SET balance = $1 WHERE user_id = $2 RETURNING *',
      [newBalance, userId]
    );
    console.log("Updated result:", result.rows);
    return result.rows[0];
  },
  

  // Gets the admin's balance (assuming admin ID is 6)
  async getAdminBalance() {
    const result = await db.query(
      'SELECT * FROM balances WHERE user_id = 6'
    );
    return result.rows[0];
  },

  // Updates the admin's balance
  async updateAdminBalance(newBalance) {
    const result = await db.query(
      'UPDATE balances SET balance = $1 WHERE user_id = 6 RETURNING *',
      [newBalance]
    );
    return result.rows[0];
  }
};

module.exports = Balance;

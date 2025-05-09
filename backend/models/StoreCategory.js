const pool = require('../db');

const StoreCategory = {
  async findAll() {
    const result = await pool.query('SELECT * FROM store_categories ORDER BY name');
    return result.rows;
  }
};

module.exports = StoreCategory;

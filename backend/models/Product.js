
const pool = require('../db');

const Product = {
  async findByStoreId(storeId) {
    const result = await pool.query(
      'SELECT * FROM products WHERE store_id = $1 AND status = false',
      [storeId]
    );
    return result.rows;
  },

  async addProduct({ name, short_description, image_url, price, unit_of_measure, quantity, store_id }) {
    const result = await pool.query(
      `INSERT INTO products 
      (name, short_description, image_url, price, unit_of_measure, quantity, store_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, short_description, image_url, price, unit_of_measure, quantity, store_id]
    );
    return result.rows[0];
  }
};

module.exports = Product;

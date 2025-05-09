const pool = require('../db');

const Cart = {
  async add({ customer_id, product_id, quantity, unit_of_measure, price }) {
    const result = await pool.query(
      `INSERT INTO shopping_cart (customer_id, product_id, quantity, unit_of_measure, price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customer_id, product_id, quantity, unit_of_measure, price]
    );
    return result.rows[0];
  },

  async findByCustomerId(customer_id) {
    const result = await pool.query(
      `SELECT sc.*, p.name, p.image_url
       FROM shopping_cart sc
       JOIN products p ON p.id = sc.product_id
       WHERE sc.customer_id = $1`,
      [customer_id]
    );
    return result.rows;
  },

  async deleteById(id) {
    const result = await pool.query(
      `DELETE FROM shopping_cart WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};

module.exports = Cart;

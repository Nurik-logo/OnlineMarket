const pool = require('../db');

const Store = {
  async findAll() {
    const result = await pool.query('SELECT * FROM stores ORDER BY rating DESC');
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findAllWithDetails(userId) {
    const result = await pool.query(`
      SELECT 
        s.*, 
        r.name AS region_name, 
        sc.name AS category_name
      FROM stores s
      LEFT JOIN regions r ON s.region_id = r.id
      LEFT JOIN store_categories sc ON s.store_category_id = sc.id
      WHERE s.user_id = $1
      ORDER BY s.rating DESC
    `, [userId]);
    return result.rows;
  },

  async create(store) {
    const { user_id, region_id, store_category_id, name, description, image_url } = store;

    const result = await pool.query(
      `INSERT INTO stores 
        (user_id, region_id, store_category_id, name, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [user_id, region_id, store_category_id, name, description, image_url]
    );

    return result.rows[0];
  }
};

module.exports = Store;

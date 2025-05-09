const pool = require('../db');

const Country = {
  async findAll() {
    const result = await pool.query('SELECT * FROM countries');
    return result.rows;
  }
};

module.exports = Country;

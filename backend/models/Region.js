const pool = require('../db');

const Region = {
  async findByCountryId(countryId) {
    const result = await pool.query('SELECT * FROM regions WHERE country_id = $1', [countryId]);
    return result.rows;
  },

  async findNameById(id) {
    const result = await pool.query('SELECT name FROM regions WHERE id = $1', [id]);
    return result.rows[0]; 
  }
};

module.exports = Region;

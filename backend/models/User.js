const pool = require('../db');
const bcrypt = require('bcryptjs');

const User = {
    async findById(id) {
        const result = await pool.query(
          `SELECT *FROM users WHERE id = $1`,
          [id]
        );
        return result.rows[0];
      },

  async findByEmailOrNickname(identifier) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR nickname = $2',
      [identifier, identifier]
    );
    return result.rows[0];
  },

  async createUser(data) {
    const {
      firstname, lastname, nickname, email,
      birthdate, gender, role = 'user',
      image, password
    } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (
        firstname, lastname, nickname, email, birthdate,
        gender, role, image, password, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *`,
      [firstname, lastname, nickname, email, birthdate, gender, role, image, hashedPassword]
    );

    return result.rows[0];
  },

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateLocation(id, country_id, region_id) {
    await pool.query(
      'UPDATE users SET country_id = $1, region_id = $2 WHERE id = $3',
      [country_id, region_id, id]
    );
  }
};

module.exports = User;

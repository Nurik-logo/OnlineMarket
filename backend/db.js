const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});

pool.connect()
  .then(() => {
    console.log('PostgreSQL дерекқорына Render-де қосылу сәтті!');
  })
  .catch(err => {
    console.error('Қосылу қатесі', err.stack);
  });


module.exports = pool;

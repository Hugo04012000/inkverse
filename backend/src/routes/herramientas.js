const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  const { nivel } = req.query;
  try {
    let query = 'SELECT * FROM herramientas';
    const params = [];
    if (nivel) {
      params.push(nivel);
      query += ' WHERE nivel = $1';
    }
    query += ' ORDER BY id ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
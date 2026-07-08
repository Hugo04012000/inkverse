const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  const { ciudad, estilo } = req.query;
  try {
    let query = `
      SELECT t.*, u.nombre, u.ciudad, u.foto_url
      FROM tatuadores t
      JOIN usuarios u ON t.usuario_id = u.id
      WHERE u.activo = true
    `;
    const params = [];
    if (ciudad && ciudad !== 'Todas') {
      params.push(ciudad);
      query += ` AND u.ciudad = $${params.length}`;
    }
    if (estilo && estilo !== 'Todos') {
      params.push(estilo);
      query += ` AND $${params.length} = ANY(t.estilos)`;
    }
    query += ' ORDER BY t.valoracion DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const verificarToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token requerido' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

router.get('/', async (req, res) => {
  const { estilo } = req.query;
  try {
    let query = `
      SELECT d.*, u.nombre as autor_nombre
      FROM disenos d
      JOIN usuarios u ON d.autor_id = u.id
    `;
    const params = [];
    if (estilo && estilo !== 'Todos') {
      params.push(estilo);
      query += ` WHERE d.estilo = $1`;
    }
    query += ' ORDER BY d.likes DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verificarToken, async (req, res) => {
  const { titulo, estilo, imagen_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO disenos (autor_id, titulo, estilo, imagen_url) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.usuario.id, titulo, estilo, imagen_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/like', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE disenos SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
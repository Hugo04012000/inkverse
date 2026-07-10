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
    res.status(401).json({ error: 'Token invalido' });
  }
};

router.post('/lista-espera', verificarToken, async (req, res) => {
  const { email } = req.body;
  try {
    const existe = await pool.query(
      'SELECT id FROM lista_espera_premium WHERE usuario_id = $1',
      [req.usuario.id]
    );
    if (existe.rows.length > 0) {
      return res.json({ mensaje: 'Ya estas en la lista de espera' });
    }
    await pool.query(
      'INSERT INTO lista_espera_premium (usuario_id, email) VALUES ($1, $2)',
      [req.usuario.id, email]
    );
    res.json({ mensaje: 'Anadido a la lista de espera' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/lista-espera', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, u.nombre FROM lista_espera_premium l
      JOIN usuarios u ON l.usuario_id = u.id
      ORDER BY l.fecha DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
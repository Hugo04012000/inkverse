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

// GET todos los posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nombre as autor_nombre
      FROM posts_foro p
      JOIN usuarios u ON p.autor_id = u.id
      ORDER BY p.fijado DESC, p.fecha DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear post
router.post('/', verificarToken, async (req, res) => {
  const { titulo, contenido, categoria } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts_foro (autor_id, titulo, contenido, categoria) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.usuario.id, titulo, contenido, categoria]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT dar like
router.put('/:id/like', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE posts_foro SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
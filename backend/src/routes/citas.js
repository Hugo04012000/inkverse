const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Middleware para verificar token
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

// GET /api/citas - obtener citas del tatuador
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, 
        u.nombre as cliente_nombre,
        b.nombre as box_nombre
      FROM citas c
      JOIN usuarios u ON c.cliente_id = u.id
      JOIN boxes b ON c.box_id = b.id
      JOIN tatuadores t ON c.tatuador_id = t.id
      WHERE t.usuario_id = $1
      ORDER BY c.fecha_inicio ASC
    `, [req.usuario.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/citas - crear nueva cita
router.post('/', verificarToken, async (req, res) => {
  const { cliente_id, box_id, fecha_inicio, duracion_horas, tamano, descripcion, precio, deposito } = req.body;
  try {
    const tatuador = await pool.query('SELECT id FROM tatuadores WHERE usuario_id = $1', [req.usuario.id]);
    if (!tatuador.rows[0]) return res.status(400).json({ error: 'No eres tatuador' });

    const result = await pool.query(`
      INSERT INTO citas (cliente_id, tatuador_id, box_id, fecha_inicio, duracion_horas, tamano, descripcion, precio, deposito)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `, [cliente_id, tatuador.rows[0].id, box_id, fecha_inicio, duracion_horas, tamano, descripcion, precio, deposito]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/citas/:id/estado - cambiar estado
router.put('/:id/estado', verificarToken, async (req, res) => {
  const { estado } = req.body;
  try {
    const result = await pool.query(
      'UPDATE citas SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/citas/:id - eliminar cita
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM citas WHERE id = $1', [req.params.id]);
    res.json({ mensaje: 'Cita eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
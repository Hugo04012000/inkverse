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

// GET notificaciones del usuario
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY fecha DESC LIMIT 20',
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT marcar todas como leídas
router.put('/leer', verificarToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notificaciones SET leida = true WHERE usuario_id = $1',
      [req.usuario.id]
    );
    res.json({ mensaje: 'Notificaciones marcadas como leídas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
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

router.post('/eventos/:id', verificarToken, async (req, res) => {
  try {
    const existe = await pool.query(
      'SELECT id FROM inscripciones_eventos WHERE usuario_id = $1 AND evento_id = $2',
      [req.usuario.id, req.params.id]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya estas inscrito en este evento' });
    }
    await pool.query(
      'INSERT INTO inscripciones_eventos (usuario_id, evento_id) VALUES ($1, $2)',
      [req.usuario.id, req.params.id]
    );
    await pool.query(
      'UPDATE eventos SET plazas_ocupadas = plazas_ocupadas + 1 WHERE id = $1',
      [req.params.id]
    );
    res.json({ mensaje: 'Inscripcion realizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mis-eventos', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT evento_id FROM inscripciones_eventos WHERE usuario_id = $1',
      [req.usuario.id]
    );
    res.json(result.rows.map(r => r.evento_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/competiciones/:id', verificarToken, async (req, res) => {
  try {
    const existe = await pool.query(
      'SELECT id FROM inscripciones_competiciones WHERE usuario_id = $1 AND competicion_id = $2',
      [req.usuario.id, req.params.id]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya estas inscrito en esta competicion' });
    }
    await pool.query(
      'INSERT INTO inscripciones_competiciones (usuario_id, competicion_id) VALUES ($1, $2)',
      [req.usuario.id, req.params.id]
    );
    await pool.query(
      'UPDATE competiciones SET artistas_inscritos = artistas_inscritos + 1 WHERE id = $1',
      [req.params.id]
    );
    res.json({ mensaje: 'Inscripcion realizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mis-competiciones', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT competicion_id FROM inscripciones_competiciones WHERE usuario_id = $1',
      [req.usuario.id]
    );
    res.json(result.rows.map(r => r.competicion_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
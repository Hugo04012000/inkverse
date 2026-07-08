const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/stats', async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT COUNT(*) FROM usuarios');
    const citas = await pool.query('SELECT COUNT(*) FROM citas');
    const disenos = await pool.query('SELECT COUNT(*) FROM disenos');
    const ingresos = await pool.query('SELECT COALESCE(SUM(precio), 0) FROM citas');
    const listaUsuarios = await pool.query(`
      SELECT u.id, u.nombre, u.email, u.rol, u.ciudad, u.activo, u.fecha_creacion,
        COUNT(c.id) as total_citas
      FROM usuarios u
      LEFT JOIN citas c ON c.cliente_id = u.id OR c.tatuador_id IN (
        SELECT id FROM tatuadores WHERE usuario_id = u.id
      )
      GROUP BY u.id
      ORDER BY u.fecha_creacion ASC
      LIMIT 20
    `);

    res.json({
      totalUsuarios: usuarios.rows[0].count,
      totalCitas: citas.rows[0].count,
      totalDisenos: disenos.rows[0].count,
      totalIngresos: ingresos.rows[0].coalesce,
      usuarios: listaUsuarios.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
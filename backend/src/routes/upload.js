const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

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

router.post('/imagen', verificarToken, async (req, res) => {
  try {
    const { imagen } = req.body;
    if (!imagen) return res.status(400).json({ error: 'No se ha enviado imagen' });
    const result = await cloudinary.uploader.upload(imagen, {
      folder: 'inkverse',
      transformation: [{ width: 800, height: 800, crop: 'limit' }]
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/citas', require('./routes/citas'));
app.use('/api/foro', require('./routes/foro'));
app.use('/api/eventos', require('./routes/eventos'));
app.use('/api/competiciones', require('./routes/competiciones'));
app.use('/api/marcas', require('./routes/marcas'));
app.use('/api/tatuadores', require('./routes/tatuadores'));
app.use('/api/herramientas', require('./routes/herramientas'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/disenos', require('./routes/disenos'));
app.use('/api/notificaciones', require('./routes/notificaciones'));
app.use('/api/premium', require('./routes/premium'));
app.use('/api/inscripciones', require('./routes/inscripciones'));
app.use('/api/upload', require('./routes/upload'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'INKVERSE API funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
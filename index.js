const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secretKey = require('./secretKey');
const { validarCredenciales, verificarToken } = require('./middlewares');
const {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  crearPublicacion
} = require('./consultas');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/users', validarCredenciales, async (req, res) => {
  try {
    const { username, email, password, profile_picture } = req.body;
    const nuevoUsuario = await registrarUsuario(username, email, password, profile_picture);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/login', validarCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await verificarCredenciales(email, password);
    const token = jwt.sign({ email: user.email, id: user.id }, secretKey, { expiresIn: '2h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
});

app.get('/users/me', verificarToken, async (req, res) => {
  try {
    const usuario = await obtenerUsuario(req.user.email);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const publicaciones = await obtenerPublicaciones();
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await obtenerPublicacionPorId(id);
    res.status(200).json(publicacion);
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
});

app.post('/posts', verificarToken, async (req, res) => {
  try {
    const { title, description, price, category, status, location, image_url } = req.body;
    const nuevaPublicacion = await crearPublicacion(
      req.user.id, title, description, price, category, status, location, image_url
    );
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Definir el puerto que asignará la nube (process.env.PORT) o el 3000 para local
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
}

module.exports = app;
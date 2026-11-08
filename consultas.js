const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Configuración de la conexión a tu PostgreSQL local
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'marketplace',
  port: 5432,
  allowExitOnIdle: true
});

// Registrar un nuevo usuario con la clave encriptada
const registrarUsuario = async (username, email, password, profile_picture) => {
  const passwordEncriptada = bcrypt.hashSync(password, 10);
  const consulta = 'INSERT INTO users (username, email, password, profile_picture) VALUES ($1, $2, $3, $4) RETURNING id, username, email';
  const valores = [username, email, passwordEncriptada, profile_picture];
  const { rows } = await pool.query(consulta, valores);
  return rows[0];
};

// Verificar las credenciales de inicio de sesión
const verificarCredenciales = async (email, password) => {
  const consulta = 'SELECT * FROM users WHERE email = $1';
  const { rows, rowCount } = await pool.query(consulta, [email]);
  if (!rowCount) throw { code: 404, message: "No existe ningún usuario con ese email" };

  const user = rows[0];
  const passwordCorrecta = bcrypt.compareSync(password, user.password);
  if (!passwordCorrecta) throw { code: 401, message: "Contraseña incorrecta" };

  return user;
};

// Obtener datos del usuario autenticado
const obtenerUsuario = async (email) => {
  const consulta = 'SELECT id, username, email, profile_picture FROM users WHERE email = $1';
  const { rows } = await pool.query(consulta, [email]);
  return rows[0];
};

// Obtener todas las publicaciones
const obtenerPublicaciones = async () => {
  const consulta = 'SELECT * FROM posts ORDER BY id DESC';
  const { rows } = await pool.query(consulta);
  return rows;
};

// Obtener una publicación por ID
const obtenerPublicacionPorId = async (id) => {
  const consulta = 'SELECT * FROM posts WHERE id = $1';
  const { rows, rowCount } = await pool.query(consulta, [id]);
  if (!rowCount) throw { code: 404, message: "Publicación no encontrada" };
  return rows[0];
};

// Crear una nueva publicación
const crearPublicacion = async (user_id, title, description, price, category, status, location, image_url) => {
  const consulta = 'INSERT INTO posts (user_id, title, description, price, category, status, location, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
  const valores = [user_id, title, description, price, category, status, location, image_url];
  const { rows } = await pool.query(consulta, valores);
  return rows[0];
};

module.exports = {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  crearPublicacion
};
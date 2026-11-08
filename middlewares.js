const jwt = require('jsonwebtoken');
const secretKey = require('./secretKey');

const validarCredenciales = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Faltan credenciales obligatorias (email y password)" });
  }
  next();
};

const verificarToken = (req, res, next) => {
  const authorizationHeader = req.header("Authorization");
  if (!authorizationHeader) {
    return res.status(401).json({ message: "No se proporcionó token de autenticación" });
  }

  const token = authorizationHeader.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = {
  validarCredenciales,
  verificarToken
};
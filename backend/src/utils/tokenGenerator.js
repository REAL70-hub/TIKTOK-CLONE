/**
 * Utilidades para generar y validar JWT
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_super_secret_key_aqui';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Genera un token JWT
 * @param {number} userId - ID del usuario
 * @returns {string} Token JWT
 */
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

/**
 * Verifica un token JWT
 * @param {string} token - Token a verificar
 * @returns {object} Payload del token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Decodifica un token sin verificar firma
 * @param {string} token - Token a decodificar
 * @returns {object} Payload del token
 */
function decodeToken(token) {
  return jwt.decode(token);
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
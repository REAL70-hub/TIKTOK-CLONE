/**
 * Utilidades para encriptación de contraseñas
 */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Encripta una contraseña
 * @param {string} password - Contraseña sin encriptar
 * @returns {Promise<string>} Contraseña encriptada
 */
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error al encriptar contraseña: ' + error.message);
  }
}

/**
 * Compara una contraseña con su hash
 * @param {string} password - Contraseña a verificar
 * @param {string} hash - Hash de la contraseña
 * @returns {Promise<boolean>} True si coinciden
 */
async function comparePassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Error al verificar contraseña: ' + error.message);
  }
}

module.exports = {
  hashPassword,
  comparePassword
};
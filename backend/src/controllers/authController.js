/**
 * Controlador de autenticación
 * Maneja registro, login y logout
 */

const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword } = require('../utils/passwordHash');
const { generateToken } = require('../utils/tokenGenerator');

const prisma = new PrismaClient();

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { email, username, password, passwordConfirm } = req.body;

    // Validaciones
    if (!email || !username || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        error: 'Las contraseñas no coinciden'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'El email o username ya están registrados'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true
      }
    });

    // Generar token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al registrar usuario',
      message: error.message
    });
  }
};

/**
 * Iniciar sesión
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generateToken(user.id);

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Sesión iniciada exitosamente',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión',
      message: error.message
    });
  }
};

/**
 * Obtener usuario actual
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            videos: true,
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[GetMe Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuario',
      message: error.message
    });
  }
};

/**
 * Logout (en realidad es solo front-end)
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
      note: 'El token debe ser eliminado del cliente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al cerrar sesión'
    });
  }
};
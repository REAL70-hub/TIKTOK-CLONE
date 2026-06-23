/**
 * Controlador de usuarios
 * Maneja perfiles, actualizaciones y estadísticas
 */

const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/passwordHash');

const prisma = new PrismaClient();

/**
 * Obtener perfil de usuario
 * GET /api/users/:id
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
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
    console.error('[GetUserProfile Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener perfil',
      message: error.message
    });
  }
};

/**
 * Obtener videos de un usuario
 * GET /api/users/:id/videos
 */
exports.getUserVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const videos = await prisma.video.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.video.count({
      where: { authorId: userId }
    });

    res.json({
      success: true,
      videos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[GetUserVideos Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener videos',
      message: error.message
    });
  }
};

/**
 * Actualizar perfil de usuario
 * PUT /api/users/:id
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { username, bio, avatar, email } = req.body;

    // Verificar que el usuario solo pueda actualizar su propio perfil
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para actualizar este perfil'
      });
    }

    // Validar que username no exista ya
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username.toLowerCase(),
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'El username ya está en uso'
        });
      }
    }

    // Actualizar perfil
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username: username.toLowerCase() }),
        ...(bio && { bio }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('[UpdateUserProfile Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar perfil',
      message: error.message
    });
  }
};

/**
 * Buscar usuarios
 * GET /api/users/search
 */
exports.searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'La búsqueda debe tener al menos 2 caracteres'
      });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q.toLowerCase(), mode: 'insensitive' } },
          { email: { contains: q.toLowerCase(), mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        _count: {
          select: { followers: true }
        }
      },
      take: parseInt(limit)
    });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('[SearchUsers Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al buscar usuarios',
      message: error.message
    });
  }
};

/**
 * Obtener seguidores de un usuario
 * GET /api/users/:id/followers
 */
exports.getUserFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
            _count: {
              select: { followers: true }
            }
          }
        }
      },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.follow.count({
      where: { followingId: userId }
    });

    res.json({
      success: true,
      followers: followers.map(f => f.follower),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[GetUserFollowers Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener seguidores',
      message: error.message
    });
  }
};

/**
 * Obtener usuarios que sigue
 * GET /api/users/:id/following
 */
exports.getUserFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
            _count: {
              select: { followers: true }
            }
          }
        }
      },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.follow.count({
      where: { followerId: userId }
    });

    res.json({
      success: true,
      following: following.map(f => f.following),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[GetUserFollowing Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener siguiendo',
      message: error.message
    });
  }
};
/**
 * Controlador de seguimiento
 * Maneja seguir/dejar de seguir usuarios
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Seguir a un usuario
 * POST /api/follows/:userId
 */
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followingId = parseInt(userId);
    const followerId = req.user.id;

    // No puedes seguirte a ti mismo
    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        error: 'No puedes seguirte a ti mismo'
      });
    }

    // Verificar que el usuario exista
    const userExists = await prisma.user.findUnique({
      where: { id: followingId }
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Verificar si ya está siguiendo
    const alreadyFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (alreadyFollowing) {
      return res.status(400).json({
        success: false,
        error: 'Ya estás siguiendo a este usuario'
      });
    }

    // Crear relación de seguimiento
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Ahora sigues a este usuario',
      follow
    });
  } catch (error) {
    console.error('[FollowUser Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al seguir usuario',
      message: error.message
    });
  }
};

/**
 * Dejar de seguir a un usuario
 * DELETE /api/follows/:userId
 */
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followingId = parseInt(userId);
    const followerId = req.user.id;

    // Buscar y eliminar la relación
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (!follow) {
      return res.status(404).json({
        success: false,
        error: 'No estás siguiendo a este usuario'
      });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    res.json({
      success: true,
      message: 'Has dejado de seguir a este usuario'
    });
  } catch (error) {
    console.error('[UnfollowUser Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al dejar de seguir',
      message: error.message
    });
  }
};

/**
 * Verificar si estás siguiendo a un usuario
 * GET /api/follows/:userId/check
 */
exports.checkFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const followingId = parseInt(userId);
    const followerId = req.user.id;

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    res.json({
      success: true,
      isFollowing: !!follow
    });
  } catch (error) {
    console.error('[CheckFollowing Error]', error);
    res.status(500).json({
      success: false,
      error: 'Error al verificar seguimiento',
      message: error.message
    });
  }
};
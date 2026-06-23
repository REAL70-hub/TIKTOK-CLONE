/**
 * Rutas de usuarios
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Rutas públicas
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserProfile);
router.get('/:id/videos', userController.getUserVideos);
router.get('/:id/followers', userController.getUserFollowers);
router.get('/:id/following', userController.getUserFollowing);

// Rutas protegidas
router.put('/:id', authMiddleware, userController.updateUserProfile);

module.exports = router;
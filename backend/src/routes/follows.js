/**
 * Rutas de seguimiento
 */

const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authMiddleware = require('../middleware/auth');

// Todas las rutas están protegidas
router.post('/:userId', authMiddleware, followController.followUser);
router.delete('/:userId', authMiddleware, followController.unfollowUser);
router.get('/:userId/check', authMiddleware, followController.checkFollowing);

module.exports = router;
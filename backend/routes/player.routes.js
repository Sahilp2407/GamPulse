const express = require('express');
const router = express.Router();
const {
    getAllPlayers,
    getPlayerById,
    createPlayer
} = require('../controllers/player.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// Public routes
router.get('/', getAllPlayers);
router.get('/:id', getPlayerById);

// Protected routes (Admin only)
router.post('/', authMiddleware, adminMiddleware, createPlayer);

module.exports = router;


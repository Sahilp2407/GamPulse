const express = require('express');
const router = express.Router();
const {
    getAllGames,
    getGameById,
    createGame,
    updateScore
} = require('../controllers/game.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// Public routes
router.get('/', getAllGames);
router.get('/:id', getGameById);

// Protected routes (Admin only)
router.post('/', authMiddleware, adminMiddleware, createGame);

// Admin only route to update score
router.patch('/:id/score', authMiddleware, adminMiddleware, updateScore);

module.exports = router;


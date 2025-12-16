const express = require('express');
const router = express.Router();
const {
    getCommentaryByGame,
    addCommentary
} = require('../controllers/commentary.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// Public routes - Get commentary for a specific game
router.get('/:gameId', getCommentaryByGame);

// Protected routes - Add commentary (ADMIN ONLY)
// Flow: authMiddleware verifies JWT → adminMiddleware checks role
router.post('/:gameId', authMiddleware, adminMiddleware, addCommentary);

module.exports = router;


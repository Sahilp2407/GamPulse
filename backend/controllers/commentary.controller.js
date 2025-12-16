const Commentary = require('../models/Commentary');
const Game = require('../models/Game');


/**
 * Get commentary for a game
 * GET /api/commentary/:gameId
 */
const getCommentaryByGame = async (req, res) => {
    try {
        const { gameId } = req.params;

        const commentary = await Commentary.find({ gameId })
            .populate('createdBy', 'name')
            .sort({ timestamp: -1 });

        res.status(200).json({
            status: 'success',
            results: commentary.length,
            data: { commentary }
        });
    } catch (error) {
        console.error('Get commentary error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error fetching commentary'
        });
    }
};

/**
 * Add commentary to a game (ADMIN ONLY)
 * POST /api/commentary/:gameId
 * 
 * Saves to database AND broadcasts via Socket.IO
 */
const addCommentary = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                status: 'error',
                message: 'Commentary text is required'
            });
        }

        // Check if game exists
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }

        // Create and save commentary to database
        const newCommentary = await Commentary.create({
            gameId: gameId,
            text: text,
            timestamp: new Date(),
            createdBy: req.user.id
        });

        // Populate createdBy field for response
        await newCommentary.populate('createdBy', 'name');

        // Prepare data for Socket.IO broadcast
        const commentaryData = {
            _id: newCommentary._id,
            gameId: newCommentary.gameId,
            text: newCommentary.text,
            timestamp: newCommentary.timestamp,
            createdBy: {
                _id: newCommentary.createdBy._id,
                name: newCommentary.createdBy.name
            }
        };

        // Emit Socket.IO event to all connected clients
        const io = req.app.get('io');
        if (io) {
            io.emit('newCommentary', commentaryData);
            console.log(`📢 Admin broadcasted & saved: "${text}"`);
        }

        // Return success response
        res.status(201).json({
            status: 'success',
            message: 'Commentary saved and broadcasted successfully',
            data: { commentary: commentaryData }
        });

    } catch (error) {
        console.error('Error adding commentary:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to add commentary'
        });
    }
};

module.exports = {
    getCommentaryByGame,
    addCommentary
};

const Game = require('../models/Game');


/**
 * Get all games
 * GET /api/games
 */
const getAllGames = async (req, res) => {
    try {
        const { status, league } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (league) filter.league = league;

        const games = await Game.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: games.length,
            data: { games }
        });
    } catch (error) {
        console.error('Get games error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error fetching games'
        });
    }
};

/**
 * Get single game by ID
 * GET /api/games/:id
 */
const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { game }
        });
    } catch (error) {
        console.error('Get game error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error fetching game'
        });
    }
};

/**
 * Create new game (admin only)
 * POST /api/games
 */
const createGame = async (req, res) => {
    try {
        const { league, teamA, teamB, status, timeRemaining } = req.body;

        // Validate required fields
        if (!league || !teamA || !teamB) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide league, teamA, and teamB'
            });
        }

        const game = await Game.create({
            league,
            teamA,
            teamB,
            status: status || 'upcoming',
            timeRemaining: timeRemaining || '00:00',
            scoreA: 0,
            scoreB: 0
        });

        res.status(201).json({
            status: 'success',
            message: 'Game created successfully',
            data: { game }
        });
    } catch (error) {
        console.error('Create game error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error creating game'
        });
    }
};

/**
 * Update game score (commentator only)
 * PATCH /api/games/:id/score
 */
const updateScore = async (req, res) => {
    try {
        const { scoreA, scoreB, status, timeRemaining } = req.body;

        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }

        // Update fields if provided
        if (scoreA !== undefined) game.scoreA = scoreA;
        if (scoreB !== undefined) game.scoreB = scoreB;
        if (status) game.status = status;
        if (timeRemaining) game.timeRemaining = timeRemaining;

        await game.save();



        res.status(200).json({
            status: 'success',
            message: 'Score updated successfully',
            data: { game }
        });
    } catch (error) {
        console.error('Update score error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error updating score'
        });
    }
};

module.exports = {
    getAllGames,
    getGameById,
    createGame,
    updateScore
};

const Player = require('../models/Player');

/**
 * Get all players
 * GET /api/players
 */
const getAllPlayers = async (req, res) => {
    try {
        const { team, position } = req.query;

        // Build filter
        const filter = {};
        if (team) filter.team = team;
        if (position) filter.position = position;

        const players = await Player.find(filter).sort({ name: 1 });

        res.status(200).json({
            status: 'success',
            results: players.length,
            data: { players }
        });
    } catch (error) {
        console.error('Get players error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error fetching players'
        });
    }
};

/**
 * Get single player by ID
 * GET /api/players/:id
 */
const getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.status(404).json({
                status: 'error',
                message: 'Player not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { player }
        });
    } catch (error) {
        console.error('Get player error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error fetching player'
        });
    }
};

/**
 * Create new player (admin only - optional, but good to have)
 * POST /api/players
 */
const createPlayer = async (req, res) => {
    try {
        const { name, team, position, stats } = req.body;

        if (!name || !team || !position) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide name, team, and position'
            });
        }

        const player = await Player.create({
            name,
            team,
            position,
            stats: stats || {}
        });

        res.status(201).json({
            status: 'success',
            message: 'Player created successfully',
            data: { player }
        });
    } catch (error) {
        console.error('Create player error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error creating player'
        });
    }
};

module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer
};

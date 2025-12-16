const mongoose = require('mongoose');

/**
 * Match Stats Schema - Stores live player stats during match
 */
const matchStatsSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        index: true
    },
    playerName: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true,
        enum: ['India', 'Australia']
    },
    role: {
        type: String,
        required: true,
        enum: ['Batsman', 'Bowler']
    },

    // Batting Stats
    runs: {
        type: Number,
        default: 0
    },
    balls: {
        type: Number,
        default: 0
    },
    fours: {
        type: Number,
        default: 0
    },
    sixes: {
        type: Number,
        default: 0
    },
    strikeRate: {
        type: Number,
        default: 0
    },
    isOnStrike: {
        type: Boolean,
        default: false
    },

    // Bowling Stats
    overs: {
        type: String,
        default: '0.0'
    },
    runsConceded: {
        type: Number,
        default: 0
    },
    wickets: {
        type: Number,
        default: 0
    },
    economy: {
        type: Number,
        default: 0
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['batting', 'out', 'bowling', 'waiting'],
        default: 'waiting'
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
matchStatsSchema.index({ matchId: 1, playerName: 1 });

module.exports = mongoose.model('MatchStats', matchStatsSchema);

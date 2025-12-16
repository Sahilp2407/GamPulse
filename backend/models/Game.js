const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    league: {
        type: String,
        required: [true, 'League is required'],
        trim: true
    },
    teamA: {
        type: String,
        required: [true, 'Team A is required'],
        trim: true
    },
    teamB: {
        type: String,
        required: [true, 'Team B is required'],
        trim: true
    },
    scoreA: {
        type: Number,
        default: 0,
        min: [0, 'Score cannot be negative']
    },
    scoreB: {
        type: Number,
        default: 0,
        min: [0, 'Score cannot be negative']
    },
    status: {
        type: String,
        enum: ['live', 'upcoming', 'finished'],
        default: 'upcoming'
    },
    timeRemaining: {
        type: String,
        default: '00:00'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
gameSchema.index({ status: 1, createdAt: -1 });
gameSchema.index({ league: 1 });

module.exports = mongoose.model('Game', gameSchema);

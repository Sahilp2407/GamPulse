const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Player name is required'],
        trim: true
    },
    team: {
        type: String,
        required: [true, 'Team is required'],
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true
    },
    stats: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Index for efficient team-based queries
playerSchema.index({ team: 1 });
playerSchema.index({ name: 1 });

module.exports = mongoose.model('Player', playerSchema);

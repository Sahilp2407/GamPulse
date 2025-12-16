const mongoose = require('mongoose');

const commentarySchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: [true, 'Game ID is required']
    },
    text: {
        type: String,
        required: [true, 'Commentary text is required'],
        trim: true,
        minlength: [1, 'Commentary cannot be empty'],
        maxlength: [500, 'Commentary cannot exceed 500 characters']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required']
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient game-based queries
commentarySchema.index({ gameId: 1, timestamp: -1 });

module.exports = mongoose.model('Commentary', commentarySchema);

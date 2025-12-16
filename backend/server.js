const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { liveMatch, commentaryPool } = require('./mock/liveMatch');
const { matchPlayers } = require('./mock/matchPlayers');
const { initializeMatchPlayers } = require('./utils/matchStatsDB');

// Routes
const authRoutes = require('./routes/auth.routes');
const gameRoutes = require('./routes/game.routes');
const playerRoutes = require('./routes/player.routes');
const commentaryRoutes = require('./routes/commentary.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with Global/Broadcast Config
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev simplicity
        methods: ["GET", "POST"]
    },
    transports: ["polling", "websocket"]
});

io.on("connection", (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Emit initial match state immediately (Global state)
    socket.emit('scoreUpdate', liveMatch);

    // Emit welcome commentary
    socket.emit('newCommentary', {
        text: "Match is live. Stay tuned for updates!",
        timestamp: Date.now()
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Auto-simulation DISABLED - Admin controls score manually
console.log('⚡ Admin-controlled mode: Score updates only via Admin Panel');

/*
// Start Real-time Simulation (DISABLED FOR ADMIN CONTROL)
console.log('🚀 Starting Real-time Match Simulation for Game ID:', liveMatch.matchId);

setInterval(() => {
    // 1. Simulate Runs (1-6)
    const runs = Math.floor(Math.random() * 6) + 1;
    liveMatch.scoreA += runs;

    // 2. Simulate Overs
    let [currOver, currBall] = liveMatch.overs.toString().split('.').map(Number);
    currBall++;

    if (currBall >= 6) {
        currOver++;
        currBall = 0;
    }

    // Update overs string
    liveMatch.overs = `${currOver}.${currBall}`;

    // 3. Emit Score Update GLOBALLY
    io.emit('scoreUpdate', liveMatch);

    console.log(`📡 Event Emitted: scoreUpdate | Score: ${liveMatch.scoreA} | Overs: ${liveMatch.overs}`);

    // 4. Randomly emit commentary (50% chance per tick) GLOBALLY
    if (Math.random() > 0.5) {
        const randomComment = commentaryPool[Math.floor(Math.random() * commentaryPool.length)];

        const commentaryData = {
            gameId: liveMatch.matchId,
            text: randomComment,
            timestamp: new Date()
        };

        io.emit('newCommentary', commentaryData);
        console.log(`💬 Event Emitted: newCommentary | "${randomComment}"`);
    }

}, 20000); // Every 20 seconds (Realistic: 1 ball)
*/


// Middleware Config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make Socket.IO instance available to controllers
app.set('io', io);

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'GamePulse API is running',
        mode: 'simulation',
        liveGameId: liveMatch.matchId,
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/commentary', commentaryRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Use PORT from .env file
const PORT = process.env.PORT || 5002;

// Connect to database and start server
connectDB()
    .then(async () => {
        // Initialize match players in database
        await initializeMatchPlayers(liveMatch.matchId.toString(), matchPlayers);

        server.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`✅ Socket.IO ready for real-time connections`);
            console.log(`🏏 Match players initialized in database`);
        });
    })
    .catch((error) => {
        console.error('❌ Failed to connect to database:', error.message);
        process.exit(1);
    });


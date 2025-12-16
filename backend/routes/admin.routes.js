const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const Commentary = require('../models/Commentary');
const Game = require('../models/Game');
const User = require('../models/User');

const {
    matchPlayers,
    updateBatsmanStats,
    updateBowlerStats,
    handleWicket
} = require('../mock/matchPlayers');
const {
    saveBatsmanStats,
    saveBowlerStats,
    handleBatsmanOut
} = require('../utils/matchStatsDB');

// Helper to save commentary to DB
async function saveCommentaryToDB(text, over) {
    try {
        // Find existing live game or create default
        let game = await Game.findOne({
            teamA: 'India',
            teamB: 'Australia',
            status: 'live'
        });

        if (!game) {
            game = await Game.create({
                league: 'T20 International',
                teamA: 'India',
                teamB: 'Australia',
                status: 'live'
            });
            console.log('🏏 Created default live match for commentary');
        }

        // Find admin user for createdBy
        let admin = await User.findOne({ role: 'admin' });

        // Fallback if no admin exists (should not happen in prod)
        if (!admin) {
            // Check if any user exists to avoid errors, or create a dummy one
            // Ideally we assume auth worked so an admin exists, but for safety:
            admin = await User.findOne({});
        }

        if (game && admin) {
            const newCommentary = await Commentary.create({
                gameId: game._id,
                text: text,
                timestamp: new Date(),
                createdBy: admin._id
            });
            return newCommentary;
        }
    } catch (error) {
        console.error('Error saving commentary to DB:', error.message);
    }
    return null;
}

/**
 * Update Score (Admin Only)
 * POST /api/admin/update-score
 */
router.post('/update-score', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { runs } = req.body;

        if (runs === undefined || runs === null) {
            return res.status(400).json({
                status: 'error',
                message: 'Runs value is required'
            });
        }

        // Get current match data from mock
        const { liveMatch } = require('../mock/liveMatch');

        // Store current over BEFORE incrementing (for commentary)
        const currentOverForCommentary = liveMatch.overs;

        // Update score
        const runsInt = parseInt(runs);
        liveMatch.scoreA += runsInt;

        // ✅ UPDATE PLAYER STATS (In-Memory)
        updateBatsmanStats(runsInt);  // Update batsman who scored
        updateBowlerStats(runsInt);   // Update bowler who conceded runs

        // ✅ SAVE PLAYER STATS TO DATABASE
        const striker = matchPlayers.currentBatsmen.find(b => b.isOnStrike);
        if (striker) {
            await saveBatsmanStats(liveMatch.matchId.toString(), striker);
        }
        await saveBowlerStats(liveMatch.matchId.toString(), matchPlayers.currentBowler);

        // Increment overs (each ball)
        const currentOvers = parseFloat(liveMatch.overs);
        const overNumber = Math.floor(currentOvers);
        const ballNumber = Math.round((currentOvers % 1) * 10);

        // Increment ball count
        const nextBall = ballNumber + 1;

        if (nextBall >= 6) {
            // Complete over, move to next over
            liveMatch.overs = `${overNumber + 1}.0`;
        } else {
            // Same over, next ball
            liveMatch.overs = `${overNumber}.${nextBall}`;
        }

        // Generate automatic commentary based on runs
        let autoCommentary = '';
        switch (runsInt) {
            case 0:
                autoCommentary = 'Dot ball! Excellent bowling, no run scored.';
                break;
            case 1:
                autoCommentary = 'Single taken. Good running between the wickets.';
                break;
            case 2:
                autoCommentary = 'Two runs! Quick running, well converted.';
                break;
            case 3:
                autoCommentary = 'Three runs! Excellent running, great placement.';
                break;
            case 4:
                autoCommentary = 'FOUR! Beautiful shot, races to the boundary!';
                break;
            case 6:
                autoCommentary = 'SIX! What a massive hit! That ball has gone into the stands!';
                break;
            default:
                autoCommentary = `${runsInt} runs scored! Good cricket.`;
        }

        // ✅ SAVE COMMENTARY TO DATABASE
        const savedCommentary = await saveCommentaryToDB(autoCommentary, currentOverForCommentary);

        // Broadcast score update via Socket.IO
        const io = req.app.get('io');
        if (io) {
            // Emit score update
            io.emit('scoreUpdate', liveMatch);

            // Emit player stats update
            io.emit('playerStatsUpdate', matchPlayers);

            // Emit auto-commentary
            // If saved to DB, use real ID, otherwise fallback
            const commentaryData = {
                _id: savedCommentary ? savedCommentary._id : Date.now().toString(),
                gameId: savedCommentary ? savedCommentary.gameId : '101',
                text: autoCommentary,
                over: currentOverForCommentary,
                timestamp: new Date().toISOString(),
                createdBy: {
                    _id: req.user.id, // Use current admin's ID
                    name: req.user.name || 'Admin User'
                }
            };
            io.emit('newCommentary', commentaryData);

            console.log(`📊 Admin updated score: +${runsInt} runs | New Score: ${liveMatch.scoreA}`);
            console.log(`💬 Auto-commentary saved: "${autoCommentary}"`);
        }

        res.json({
            status: 'success',
            message: `Score updated! Added ${runsInt} runs`,
            data: {
                runs: runsInt,
                newScore: liveMatch.scoreA,
                overs: liveMatch.overs,
                commentary: autoCommentary
            }
        });

    } catch (error) {
        console.error('Score update error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update score'
        });
    }
});

/**
 * Update Wickets (Admin Only)
 * POST /api/admin/update-wickets
 */
router.post('/update-wickets', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { wickets } = req.body;

        if (wickets === undefined || wickets === null) {
            return res.status(400).json({
                status: 'error',
                message: 'Wickets value is required'
            });
        }

        // Get current match data from mock
        const { liveMatch } = require('../mock/liveMatch');

        // Store current over BEFORE incrementing (for commentary)
        const currentOverForCommentary = liveMatch.overs;

        // Update wickets
        const wicketsInt = parseInt(wickets);
        liveMatch.wicketsA += wicketsInt;

        // ✅ HANDLE WICKET - Bring next batsman (In-Memory)
        let outBatsmanName = null;
        let newBatsmanName = null;

        if (wicketsInt > 0) {
            const outBatsman = matchPlayers.currentBatsmen.find(b => b.isOnStrike);
            outBatsmanName = outBatsman ? outBatsman.name : null;
            newBatsmanName = matchPlayers.nextBatsman.name;

            handleWicket();

            // ✅ SAVE PLAYER STATS TO DATABASE
            if (outBatsmanName && newBatsmanName) {
                await handleBatsmanOut(
                    liveMatch.matchId.toString(),
                    outBatsmanName,
                    newBatsmanName
                );
            }
            // Save updated bowler wicket count
            await saveBowlerStats(liveMatch.matchId.toString(), matchPlayers.currentBowler);
        }

        // Check for All Out (10 wickets)
        if (liveMatch.wicketsA >= 10) {
            liveMatch.wicketsA = 10; // Cap at 10
            liveMatch.status = 'ALL OUT'; // Change status
        }

        // Increment overs (each ball)
        const currentOvers = parseFloat(liveMatch.overs);
        const overNumber = Math.floor(currentOvers);
        const ballNumber = Math.round((currentOvers % 1) * 10);

        // Increment ball count
        const nextBall = ballNumber + 1;

        if (nextBall >= 6) {
            // Complete over, move to next over
            liveMatch.overs = `${overNumber + 1}.0`;
        } else {
            // Same over, next ball
            liveMatch.overs = `${overNumber}.${nextBall}`;
        }

        // Generate automatic commentary for wicket
        const wicketCommentaries = [
            'WICKET! Clean bowled! The stumps are shattered!',
            'OUT! Caught behind! The keeper takes a brilliant catch!',
            'WICKET! LBW! The umpire raises his finger!',
            'OUT! Caught at slip! What a catch!',
            'WICKET! Run out! Brilliant fielding!',
            'OUT! Stumped! The keeper was lightning quick!',
            'WICKET! Caught in the deep! The fielder judges it perfectly!'
        ];

        let autoCommentary = wicketCommentaries[Math.floor(Math.random() * wicketCommentaries.length)];

        // Add All Out message if team is all out
        if (liveMatch.wicketsA >= 10) {
            autoCommentary += ' TEAM ALL OUT! Innings complete!';
        }

        // ✅ SAVE COMMENTARY TO DATABASE
        const savedCommentary = await saveCommentaryToDB(autoCommentary, currentOverForCommentary);

        // Broadcast wicket update via Socket.IO
        const io = req.app.get('io');
        if (io) {
            // Emit score update (with new wicket count)
            io.emit('scoreUpdate', liveMatch);

            // Emit player stats update (with new batsman)
            io.emit('playerStatsUpdate', matchPlayers);

            // Emit auto-commentary
            const commentaryData = {
                _id: savedCommentary ? savedCommentary._id : Date.now().toString(),
                gameId: savedCommentary ? savedCommentary.gameId : '101',
                text: autoCommentary,
                over: currentOverForCommentary,
                timestamp: new Date().toISOString(),
                createdBy: {
                    _id: req.user.id,
                    name: req.user.name || 'Admin User'
                }
            };
            io.emit('newCommentary', commentaryData);

            console.log(`🎯 Admin updated wickets: +${wicketsInt} | New Wickets: ${liveMatch.wicketsA}`);
            console.log(`💬 Auto-commentary saved: "${autoCommentary}"`);
        }

        res.json({
            status: 'success',
            message: `Wicket updated! Added ${wicketsInt} wicket(s)`,
            data: {
                wickets: wicketsInt,
                newWickets: liveMatch.wicketsA,
                overs: liveMatch.overs,
                commentary: autoCommentary
            }
        });

    } catch (error) {
        console.error('Wicket update error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update wickets'
        });
    }
});

module.exports = router;

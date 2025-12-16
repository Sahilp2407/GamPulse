const MatchStats = require('../models/MatchStats');

/**
 * Initialize match players in database
 * Call this when match starts
 */
async function initializeMatchPlayers(matchId, players) {
    try {
        // Clear existing stats for this match
        await MatchStats.deleteMany({ matchId });

        // Create initial records for all players
        const playerRecords = [];

        // Add batsmen
        if (players.currentBatsmen) {
            players.currentBatsmen.forEach(batsman => {
                playerRecords.push({
                    matchId,
                    playerName: batsman.name,
                    team: batsman.team,
                    role: 'Batsman',
                    runs: batsman.runs,
                    balls: batsman.balls,
                    fours: batsman.fours,
                    sixes: batsman.sixes,
                    strikeRate: batsman.strikeRate,
                    isOnStrike: batsman.isOnStrike,
                    status: 'batting',
                    isActive: true
                });
            });
        }

        // Add bowler
        if (players.currentBowler) {
            playerRecords.push({
                matchId,
                playerName: players.currentBowler.name,
                team: players.currentBowler.team,
                role: 'Bowler',
                overs: players.currentBowler.overs.toString(),
                runsConceded: players.currentBowler.runs,
                wickets: players.currentBowler.wickets,
                economy: players.currentBowler.economy,
                status: 'bowling',
                isActive: true
            });
        }

        // Add next batsman
        if (players.nextBatsman) {
            playerRecords.push({
                matchId,
                playerName: players.nextBatsman.name,
                team: players.nextBatsman.team,
                role: 'Batsman',
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                strikeRate: 0,
                isOnStrike: false,
                status: 'waiting',
                isActive: true
            });
        }

        // Insert all records
        await MatchStats.insertMany(playerRecords);
        console.log(`✅ Initialized ${playerRecords.length} players in database for match ${matchId}`);

        return true;
    } catch (error) {
        console.error('Error initializing match players:', error);
        return false;
    }
}

/**
 * Update batsman stats in database
 */
async function saveBatsmanStats(matchId, batsman) {
    try {
        await MatchStats.findOneAndUpdate(
            { matchId, playerName: batsman.name },
            {
                runs: batsman.runs,
                balls: batsman.balls,
                fours: batsman.fours,
                sixes: batsman.sixes,
                strikeRate: batsman.strikeRate,
                isOnStrike: batsman.isOnStrike,
                status: 'batting'
            },
            { upsert: true, new: true }
        );

        console.log(`💾 Saved ${batsman.name} stats: ${batsman.runs}(${batsman.balls})`);
    } catch (error) {
        console.error('Error saving batsman stats:', error);
    }
}

/**
 * Update bowler stats in database
 */
async function saveBowlerStats(matchId, bowler) {
    try {
        await MatchStats.findOneAndUpdate(
            { matchId, playerName: bowler.name },
            {
                overs: bowler.overs.toString(),
                runsConceded: bowler.runs,
                wickets: bowler.wickets,
                economy: bowler.economy,
                status: 'bowling'
            },
            { upsert: true, new: true }
        );

        console.log(`💾 Saved ${bowler.name} bowling: ${bowler.overs} ov, ${bowler.runs} runs, ${bowler.wickets} wkts`);
    } catch (error) {
        console.error('Error saving bowler stats:', error);
    }
}

/**
 * Mark batsman as out and activate next batsman
 */
async function handleBatsmanOut(matchId, outBatsmanName, newBatsmanName) {
    try {
        // Mark out batsman
        await MatchStats.findOneAndUpdate(
            { matchId, playerName: outBatsmanName },
            {
                status: 'out',
                isActive: false,
                isOnStrike: false
            }
        );

        // Activate new batsman
        await MatchStats.findOneAndUpdate(
            { matchId, playerName: newBatsmanName },
            {
                status: 'batting',
                isActive: true,
                isOnStrike: true
            }
        );

        console.log(`🏏 ${outBatsmanName} OUT → ${newBatsmanName} IN`);
    } catch (error) {
        console.error('Error handling batsman out:', error);
    }
}

/**
 * Get all active players for a match
 */
async function getMatchPlayers(matchId) {
    try {
        const players = await MatchStats.find({ matchId, isActive: true })
            .sort({ createdAt: 1 });
        return players;
    } catch (error) {
        console.error('Error getting match players:', error);
        return [];
    }
}

/**
 * Get match summary
 */
async function getMatchSummary(matchId) {
    try {
        const batsmen = await MatchStats.find({
            matchId,
            role: 'Batsman'
        }).sort({ runs: -1 });

        const bowlers = await MatchStats.find({
            matchId,
            role: 'Bowler'
        }).sort({ wickets: -1 });

        return {
            batsmen,
            bowlers
        };
    } catch (error) {
        console.error('Error getting match summary:', error);
        return { batsmen: [], bowlers: [] };
    }
}

module.exports = {
    initializeMatchPlayers,
    saveBatsmanStats,
    saveBowlerStats,
    handleBatsmanOut,
    getMatchPlayers,
    getMatchSummary
};

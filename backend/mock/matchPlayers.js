/**
 * Live Match Players - Real-time tracking
 * All stats start from 0 and update based on admin panel actions
 */

const matchPlayers = {
    // Current Batsmen (India)
    currentBatsmen: [
        {
            id: 'bat1',
            name: 'Virat Kohli',
            team: 'India',
            role: 'Batsman',
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isOnStrike: true  // Currently facing
        },
        {
            id: 'bat2',
            name: 'Rohit Sharma',
            team: 'India',
            role: 'Batsman',
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isOnStrike: false  // Non-striker
        }
    ],

    // Current Bowler (Australia)
    currentBowler: {
        id: 'bowl1',
        name: 'Mitchell Starc',
        team: 'Australia',
        role: 'Bowler',
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        economy: 0
    },

    // Next Batsman (India) - Will come if wicket falls
    nextBatsman: {
        id: 'bat3',
        name: 'KL Rahul',
        team: 'India',
        role: 'Batsman',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        isOnStrike: false
    }
};

/**
 * Update batsman stats when runs are scored
 */
function updateBatsmanStats(runs) {
    const striker = matchPlayers.currentBatsmen.find(b => b.isOnStrike);

    if (striker) {
        striker.runs += runs;
        striker.balls += 1;

        // Track boundaries
        if (runs === 4) striker.fours += 1;
        if (runs === 6) striker.sixes += 1;

        // Calculate strike rate
        striker.strikeRate = striker.balls > 0
            ? ((striker.runs / striker.balls) * 100).toFixed(2)
            : 0;

        // Rotate strike if odd runs (1, 3, 5)
        if (runs % 2 !== 0) {
            rotateStrike();
        }
    }
}

/**
 * Update bowler stats when runs are conceded
 */
function updateBowlerStats(runs) {
    matchPlayers.currentBowler.runs += runs;
    matchPlayers.currentBowler.balls += 1;

    // Calculate overs (6 balls = 1 over)
    const totalBalls = matchPlayers.currentBowler.balls;
    const overs = Math.floor(totalBalls / 6);
    const remainingBalls = totalBalls % 6;
    matchPlayers.currentBowler.overs = `${overs}.${remainingBalls}`;

    // Calculate economy rate
    const oversCompleted = totalBalls / 6;
    matchPlayers.currentBowler.economy = oversCompleted > 0
        ? (matchPlayers.currentBowler.runs / oversCompleted).toFixed(2)
        : 0;
}

/**
 * Rotate strike between batsmen
 */
function rotateStrike() {
    matchPlayers.currentBatsmen.forEach(batsman => {
        batsman.isOnStrike = !batsman.isOnStrike;
    });
}

/**
 * Handle wicket - bring next batsman
 */
function handleWicket() {
    // Find the batsman who got out (currently on strike)
    const outBatsmanIndex = matchPlayers.currentBatsmen.findIndex(b => b.isOnStrike);

    if (outBatsmanIndex !== -1) {
        // Replace with next batsman
        matchPlayers.currentBatsmen[outBatsmanIndex] = {
            ...matchPlayers.nextBatsman,
            isOnStrike: true  // New batsman takes strike
        };

        // Update bowler wicket count
        matchPlayers.currentBowler.wickets += 1;

        console.log(`🏏 Wicket! ${matchPlayers.nextBatsman.name} is the new batsman`);
    }
}

/**
 * Reset all stats to 0
 */
function resetMatchPlayers() {
    // Reset batsmen
    matchPlayers.currentBatsmen.forEach(batsman => {
        batsman.runs = 0;
        batsman.balls = 0;
        batsman.fours = 0;
        batsman.sixes = 0;
        batsman.strikeRate = 0;
    });

    // Reset bowler
    matchPlayers.currentBowler.overs = 0;
    matchPlayers.currentBowler.balls = 0;
    matchPlayers.currentBowler.runs = 0;
    matchPlayers.currentBowler.wickets = 0;
    matchPlayers.currentBowler.economy = 0;

    // Reset next batsman
    matchPlayers.nextBatsman.runs = 0;
    matchPlayers.nextBatsman.balls = 0;
    matchPlayers.nextBatsman.fours = 0;
    matchPlayers.nextBatsman.sixes = 0;
    matchPlayers.nextBatsman.strikeRate = 0;

    console.log('✅ All player stats reset to 0');
}

module.exports = {
    matchPlayers,
    updateBatsmanStats,
    updateBowlerStats,
    rotateStrike,
    handleWicket,
    resetMatchPlayers
};

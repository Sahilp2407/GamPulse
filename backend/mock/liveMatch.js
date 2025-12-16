const liveMatch = {
    matchId: 101,
    teamA: "India",
    teamB: "Australia",
    scoreA: 0,
    scoreB: 0,
    wicketsA: 0,
    wicketsB: 0,
    overs: "0.0",
    status: "LIVE"
};

const commentaryPool = [
    "What a delivery! Swinging in and beating the outside edge.",
    "Four runs! Beautiful cover drive piercing the gap.",
    "Huge shout for LBW! Umpire says not out.",
    "Six! That's a massive hit into the second tier.",
    "Single taken, sensible batting here.",
    "Direct hit at the non-striker's end! Umpire goes upstairs.",
    "Dropped! That was a difficult chance at slip.",
    "Wicket! Clean bowled! The middle stump is out of the ground.",
    "Good running between the wickets, turning one into two.",
    "Edged and taken! The keeper makes no mistake."
];

module.exports = {
    liveMatch,
    commentaryPool
};

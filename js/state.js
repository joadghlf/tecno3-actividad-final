var GameState = {
    screen: 'intro',
    currentMission: null,
    score: 0,
    completedMissions: [],
    audioEnabled: true,
    badgesUnlocked: [],

    reset: function (keepAudio) {
        var audio = keepAudio ? this.audioEnabled : true;

        this.screen = 'intro';
        this.currentMission = null;
        this.score = 0;
        this.completedMissions = [];
        this.badgesUnlocked = [];
        this.audioEnabled = audio;
    },

    completeMission: function (missionId, points) {
        var wasNew = this.completedMissions.indexOf(missionId) === -1;

        if (wasNew) {
            this.completedMissions.push(missionId);
            this.score += points || 0;
            this.updateBadges();
        }
    },

    updateBadges: function () {
        var count = this.completedMissions.length;
        var self = this;

        GAME_DATA.badges.forEach(function (badge) {
            if (count >= badge.unlockAfter && self.badgesUnlocked.indexOf(badge.id) === -1) {
                self.badgesUnlocked.push(badge.id);
            }
        });
    },

    isMissionUnlocked: function (missionId) {
        if (missionId === 1) return true;
        return this.completedMissions.indexOf(missionId - 1) !== -1;
    },

    isMissionDone: function (missionId) {
        return this.completedMissions.indexOf(missionId) !== -1;
    },

    getProgressPercent: function () {
        return (this.completedMissions.length / GAME_DATA.missions.length) * 100;
    },

    getScoreTier: function () {
        var thresholds = GAME_DATA.debrief.scoreThresholds;

        if (this.score >= thresholds.high) return 'high';
        if (this.score >= thresholds.mid) return 'mid';
        return 'low';
    },

    getUnlockedBadgeCount: function () {
        return this.badgesUnlocked.length;
    }
};

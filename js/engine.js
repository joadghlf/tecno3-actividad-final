var GameEngine = {
    goToIntro: function () {
        GameState.screen = 'intro';
        GameState.currentMission = null;
        GameUI.refresh();
    },

    goToMap: function () {
        GameState.screen = 'map';
        GameState.currentMission = null;
        GameUI.refresh();
    },

    startMission: function (missionId) {
        if (!GameState.isMissionUnlocked(missionId)) return;

        GameState.screen = 'mission';
        GameState.currentMission = missionId;
        GameUI.refresh();
    },

    completeCurrentMission: function (points) {
        var missionId = GameState.currentMission;
        if (!missionId) return;

        var wasNew = !GameState.isMissionDone(missionId);
        GameState.completeMission(missionId, points);

        if (wasNew) {
            GameAudio.unlock();
        }

        if (GameState.completedMissions.length >= GAME_DATA.missions.length) {
            this.goToDebrief();
        } else {
            this.goToMap();
        }
    },

    goToDebrief: function () {
        GameState.screen = 'debrief';
        GameUI.renderDebrief();
        GameUI.updateHud();
    },

    restart: function () {
        var audioOn = GameState.audioEnabled;
        GameState.reset(true);
        GameAudio.setEnabled(audioOn);
        GameUI.refresh();
    }
};

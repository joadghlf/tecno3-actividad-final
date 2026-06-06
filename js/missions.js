var MissionRouter = {
    render: function (missionId, container) {
        switch (missionId) {
            case 1:
                Mission1.start(container);
                break;
            case 2:
                Mission2.start(container);
                break;
            case 3:
                Mission3.start(container);
                break;
            case 4:
                Mission4.start(container);
                break;
            case 5:
                Mission5.start(container);
                break;
            default:
                GameUI.renderMissionPlaceholder(missionId);
        }
    }
};

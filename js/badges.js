var BadgeIcons = {
    eye: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="2"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
};

var BadgeUI = {
    getIcon: function (name) {
        return BadgeIcons[name] || BadgeIcons.eye;
    },

    renderCompact: function () {
        return '<div class="badge-row">' + GAME_DATA.badges.map(function (badge) {
            var unlocked = GameState.badgesUnlocked.indexOf(badge.id) !== -1;
            return ''
                + '<span class="badge' + (unlocked ? ' is-unlocked' : '') + '">'
                + '<span class="badge-mini-icon">' + BadgeUI.getIcon(badge.icon) + '</span>'
                + (unlocked ? badge.label : 'Pendiente')
                + '</span>';
        }).join('') + '</div>';
    },

    renderCards: function (animate) {
        return '<div class="badge-grid">' + GAME_DATA.badges.map(function (badge) {
            var unlocked = GameState.badgesUnlocked.indexOf(badge.id) !== -1;
            var cls = 'badge-card' + (unlocked ? ' is-unlocked' : ' is-locked');
            if (animate && unlocked) cls += ' animate-badge-pop';

            return ''
                + '<div class="' + cls + '">'
                + '<div class="badge-card-icon">' + BadgeUI.getIcon(badge.icon) + '</div>'
                + '<strong>' + badge.label + '</strong>'
                + '<p>' + (unlocked ? badge.desc : 'Completá más misiones para desbloquear esta insignia.') + '</p>'
                + '<span class="badge-card-status">' + (unlocked ? 'Desbloqueada' : 'Bloqueada') + '</span>'
                + '</div>';
        }).join('') + '</div>';
    }
};

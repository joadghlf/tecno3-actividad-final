var GameUI = {
    screenEl: null,
    progressFill: null,
    progressLabel: null,
    progressStep: null,
    progressBar: null,
    hudScore: null,

    init: function () {
        this.screenEl = document.getElementById('game-screen');
        this.progressFill = document.getElementById('progress-fill');
        this.progressLabel = document.getElementById('progress-label');
        this.progressStep = document.getElementById('progress-step');
        this.progressBar = document.querySelector('.game-progress-bar');
        this.hudScore = document.getElementById('hud-score');
    },

    updateHud: function () {
        this.hudScore.textContent = 'Puntos: ' + GameState.score;

        var completed = GameState.completedMissions.length;
        var total = GAME_DATA.missions.length;
        var percent = GameState.getProgressPercent();

        this.progressFill.style.width = percent + '%';
        this.progressBar.setAttribute('aria-valuenow', String(Math.round(percent)));
        this.progressStep.textContent = completed + ' / ' + total + ' misiones';

        var labels = {
            intro: 'Inicio',
            map: 'Mapa de misiones',
            mission: 'Misión ' + (GameState.currentMission || ''),
            debrief: 'Recorrido finalizado'
        };

        this.progressLabel.textContent = labels[GameState.screen] || 'En juego';
    },

    renderPasPanel: function () {
        return GAME_DATA.pas.map(function (item) {
            return ''
                + '<div class="pas-item">'
                + '<div class="pas-letter">' + item.letter + '</div>'
                + '<div><strong>' + item.name + '</strong><small>' + item.hint + '</small></div>'
                + '</div>';
        }).join('');
    },

    renderBadges: function () {
        return BadgeUI.renderCompact();
    },

    getScoreTierLabel: function (tier) {
        if (tier === 'high') return 'Recorrido destacado';
        if (tier === 'mid') return 'Buen avance';
        return 'Recorrido en construcción';
    },

    renderDebrief: function () {
        var tier = GameState.getScoreTier();
        var tierLabel = this.getScoreTierLabel(tier);
        var message = GAME_DATA.debrief.scoreMessages[tier];
        var keysHtml = GAME_DATA.mission5.keyIdeas.map(function (idea) {
            return '<li><span class="m5-key-check">OK</span><span>' + idea + '</span></li>';
        }).join('');

        var confettiHtml = tier === 'high'
            ? '<div class="debrief-confetti" aria-hidden="true">'
                + '<span></span><span></span><span></span><span></span><span></span><span></span>'
                + '</div>'
            : '';

        this.screenEl.innerHTML = ''
            + '<section class="card debrief-wrap animate-in">'
            + confettiHtml
            + '<div class="debrief-inner">'
            + '<div class="debrief-hero">'
            + '<span class="debrief-tier is-' + tier + '">' + tierLabel + '</span>'
            + '<div class="debrief-score-ring">'
            + '<div><strong>' + GameState.score + '</strong><small>puntos</small></div>'
            + '</div>'
            + '<h2 class="screen-title">Juego completado</h2>'
            + '<p class="screen-subtitle">' + message + '</p>'
            + '</div>'
            + '<div class="debrief-stats">'
            + '<div class="debrief-stat"><strong>5/5</strong><span>Misiones</span></div>'
            + '<div class="debrief-stat"><strong>' + GameState.getUnlockedBadgeCount() + '/3</strong><span>Insignias</span></div>'
            + '<div class="debrief-stat"><strong>' + GameState.score + '</strong><span>Puntaje total</span></div>'
            + '</div>'
            + '<h3 class="debrief-section-title">Insignias del recorrido</h3>'
            + BadgeUI.renderCards(true)
            + '<h3 class="debrief-section-title" id="debrief-keys">Ideas clave del recorrido</h3>'
            + '<ul class="m5-key-list">' + keysHtml + '</ul>'
            + '<div class="m5-reflection">'
            + '<label for="game-reflection">' + GAME_DATA.mission5.reflectionPrompt + '</label>'
            + '<textarea id="game-reflection" placeholder="Reflexión personal para el foro del curso."></textarea>'
            + '<small>Esta respuesta no se guarda automáticamente. Podés copiarla y compartirla en el foro del LMS.</small>'
            + '</div>'
            + '<div class="debrief-actions">'
            + '<button type="button" class="btn-primary" id="btn-restart">Volver a intentar todo</button>'
            + '<button type="button" class="btn-secondary" id="btn-review-keys">Revisar ideas clave</button>'
            + '<button type="button" class="btn-copy" id="btn-copy-reflection">Copiar reflexión</button>'
            + '<button type="button" class="btn-secondary" id="btn-map-final">Ver mapa</button>'
            + '</div>'
            + '</div></section>';

        document.getElementById('btn-restart').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.restart();
        });

        document.getElementById('btn-review-keys').addEventListener('click', function () {
            GameAudio.click();
            var el = document.getElementById('debrief-keys');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        document.getElementById('btn-map-final').addEventListener('click', function () {
            GameAudio.click();
            GameState.screen = 'map';
            GameUI.refresh();
        });

        document.getElementById('btn-copy-reflection').addEventListener('click', function () {
            var textarea = document.getElementById('game-reflection');
            var btn = document.getElementById('btn-copy-reflection');
            var text = textarea.value.trim();

            if (!text) {
                textarea.focus();
                return;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    btn.classList.add('is-copied');
                    btn.textContent = 'Copiado';
                    GameAudio.success();
                    setTimeout(function () {
                        btn.classList.remove('is-copied');
                        btn.textContent = 'Copiar reflexión';
                    }, 2000);
                });
            } else {
                textarea.select();
                document.execCommand('copy');
                btn.textContent = 'Copiado';
                GameAudio.success();
            }
        });

        if (tier === 'high') {
            GameAudio.unlock();
        }
    },

    renderIntro: function () {
        var intro = GAME_DATA.intro;

        this.screenEl.innerHTML = ''
            + '<section class="card animate-in intro-grid">'
            + '<div>'
            + '<div class="intro-labels">'
            + '<span class="label label-teal">Juego de repaso formativo</span>'
            + '<span class="label label-blue">Curso: Nociones básicas de primeros auxilios</span>'
            + '</div>'
            + '<h2 class="screen-title">' + GAME_DATA.title + '</h2>'
            + '<p class="screen-subtitle">' + GAME_DATA.subtitle + '</p>'
            + '<p class="intro-lead">' + intro.lead + '</p>'
            + '<ul class="intro-list">' + intro.goals.map(function (g) { return '<li>' + g + '</li>'; }).join('') + '</ul>'
            + '<div class="notice" style="margin-top:16px">' + intro.notice + '</div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-primary" id="btn-start">' + intro.cta + '</button>'
            + '</div>'
            + '</div>'
            + '<aside class="pas-panel">' + this.renderPasPanel() + '</aside>'
            + '</section>';

        document.getElementById('btn-start').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });
    },

    renderMap: function () {
        var self = this;
        var nodes = GAME_DATA.missions.map(function (mission) {
            var unlocked = GameState.isMissionUnlocked(mission.id);
            var done = GameState.isMissionDone(mission.id);
            var active = !done && unlocked;
            var cls = 'mission-node';
            if (done) cls += ' is-done';
            if (active) cls += ' is-active';

            var status = done ? 'Completada' : (unlocked ? 'Jugar' : 'Bloqueada');

            return ''
                + '<button type="button" class="' + cls + '" data-mission="' + mission.id + '"'
                + (unlocked ? '' : ' disabled')
                + '>'
                + '<span class="mission-number">' + mission.id + '</span>'
                + '<span class="mission-info"><h3>' + mission.title + '</h3>'
                + '<p>' + mission.description + ' · ' + mission.mechanic + '</p></span>'
                + '<span class="mission-status">' + status + '</span>'
                + '</button>';
        }).join('');

        var allDone = GameState.completedMissions.length >= GAME_DATA.missions.length;

        this.screenEl.innerHTML = ''
            + '<section class="card animate-in">'
            + '<div class="map-header">'
            + '<h2 class="screen-title">Mapa de misiones</h2>'
            + '<p>' + (allDone
                ? 'Completaste todas las misiones. Podés reintentar cualquiera o ver tu resumen final.'
                : 'Completá cada misión para desbloquear la siguiente. El puntaje es orientativo y formativo.') + '</p>'
            + '</div>'
            + '<div class="mission-map">' + nodes + '</div>'
            + this.renderBadges()
            + '<div class="screen-actions">'
            + (allDone ? '<button type="button" class="btn-primary" id="btn-view-debrief">Ver resumen final</button>' : '')
            + '<button type="button" class="btn-secondary" id="btn-back-intro">Volver al inicio</button>'
            + '</div>'
            + '</section>';

        this.screenEl.querySelectorAll('[data-mission]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                GameAudio.click();
                GameEngine.startMission(parseInt(btn.getAttribute('data-mission'), 10));
            });
        });

        document.getElementById('btn-back-intro').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToIntro();
        });

        if (allDone) {
            document.getElementById('btn-view-debrief').addEventListener('click', function () {
                GameAudio.click();
                GameEngine.goToDebrief();
            });
        }
    },

    renderMission: function (missionId) {
        this.screenEl.innerHTML = '';
        MissionRouter.render(missionId, this.screenEl);
        this.updateHud();
    },

    renderMissionPlaceholder: function (missionId) {
        var mission = GAME_DATA.missions[missionId - 1];

        this.screenEl.innerHTML = ''
            + '<section class="card animate-in placeholder-mission">'
            + '<div class="icon-large">' + missionId + '</div>'
            + '<h2 class="screen-title">' + mission.title + '</h2>'
            + '<p class="screen-subtitle">' + mission.description + '</p>'
            + '<p>Esta misión no está disponible.</p>'
            + '<div class="screen-actions" style="justify-content:center">'
            + '<button type="button" class="btn-secondary" id="btn-back-map">Volver al mapa</button>'
            + '</div>'
            + '</section>';

        document.getElementById('btn-back-map').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });
    },

    refresh: function () {
        this.updateHud();

        switch (GameState.screen) {
            case 'intro':
                this.renderIntro();
                break;
            case 'map':
                this.renderMap();
                break;
            case 'mission':
                if (GameState.currentMission >= 1 && GameState.currentMission <= 5) {
                    this.renderMission(GameState.currentMission);
                } else {
                    this.renderMissionPlaceholder(GameState.currentMission);
                }
                break;
            case 'debrief':
                this.renderDebrief();
                break;
            default:
                this.renderIntro();
        }
    }
};

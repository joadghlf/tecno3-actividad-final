var Mission5 = {
    container: null,
    phase: 'intro',
    round: 0,
    decisionScore: 0,
    missionPoints: 0,
    statusDone: {},
    locked: false,
    history: [],

    start: function (container) {
        this.container = container;
        this.phase = 'intro';
        this.round = 0;
        this.decisionScore = 0;
        this.missionPoints = 0;
        this.statusDone = {};
        this.locked = false;
        this.history = [];
        this.renderIntro();
    },

    restartMission: function () {
        this.round = 0;
        this.decisionScore = 0;
        this.missionPoints = 0;
        this.statusDone = {};
        this.locked = false;
        this.history = [];
        this.renderIntro();
    },

    renderIntro: function () {
        var self = this;
        var intro = GAME_DATA.mission5.intro;

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-5 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 5: ' + intro.title + '</h2>'
            + '<div class="mission-meta"><span class="meta-pill">Simulador final</span></div>'
            + '</div>'
            + '<div class="m5-layout">'
            + this.renderScenePanel()
            + '<div class="m5-decision-panel">'
            + '<p class="mission-phase-label">Briefing del caso</p>'
            + '<div class="m5-context">' + intro.text + '</div>'
            + '<p>' + intro.goal + '</p>'
            + '<p class="mission-help">Vas a tomar 4 decisiones. Cada una repasa un momento clave del PAS.</p>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m5-back">Volver al mapa</button>'
            + '<button type="button" class="btn-primary" id="m5-start">Comenzar simulación</button>'
            + '</div></div></div></div>';

        document.getElementById('m5-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        document.getElementById('m5-start').addEventListener('click', function () {
            GameAudio.click();
            self.phase = 'play';
            self.renderDecision();
        });
    },

    renderStatusList: function () {
        return ''
            + '<div class="m5-status-list">'
            + GAME_DATA.mission5.statusLabels.map(function (s) {
                var done = !!Mission5.statusDone[s.key];
                return ''
                    + '<div class="m5-status-item' + (done ? ' is-done' : '') + '" data-status="' + s.key + '">'
                    + '<span class="m5-status-dot"></span>'
                    + '<span>' + s.label + '</span>'
                    + '</div>';
            }).join('')
            + '</div>';
    },

    renderScenePanel: function () {
        var secured = this.statusDone.protect;
        var helped = this.statusDone.help;
        var alertCls = this.phase === 'intro' || this.round === 0 ? ' is-alert' : '';

        return ''
            + '<div class="m5-scene-panel">'
            + '<div class="m5-scene-live' + alertCls + '">'
            + '<div class="m5-scene-banner">Club comunitario</div>'
            + '<span class="m5-scene-marker m5-scene-crowd">Gente cerca</span>'
            + '<span class="m5-scene-marker m5-scene-victim' + (helped ? ' is-helped' : '') + '">Persona mareada</span>'
            + '<span class="m5-scene-marker m5-scene-bottle' + (secured ? ' is-secured' : '') + '">Botella rota</span>'
            + '<span class="m5-scene-marker m5-scene-chair' + (secured ? ' is-secured' : '') + '">Silla caída</span>'
            + '</div>'
            + this.renderStatusList()
            + '</div>';
    },

    renderPasStepper: function () {
        var steps = GAME_DATA.mission5.decisions;

        return steps.map(function (step, idx) {
            var cls = 'm5-pas-step';
            if (idx === Mission5.round) cls += ' is-active';
            else if (idx < Mission5.round) cls += ' is-done';
            return '<div class="' + cls + '"><span>' + step.pas + '</span></div>';
        }).join('');
    },

    renderDecision: function () {
        var self = this;
        var decision = GAME_DATA.mission5.decisions[this.round];

        if (!decision) {
            this.renderFinal();
            return;
        }

        var optionsHtml = decision.options.map(function (opt, idx) {
            return ''
                + '<button type="button" class="m5-option" data-index="' + idx + '">'
                + '<span class="m5-option-letter">' + String.fromCharCode(65 + idx) + '</span>'
                + '<span>' + opt.text + '</span>'
                + '<span style="color:var(--c-teal);font-weight:900">›</span>'
                + '</button>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-5 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 5: ' + decision.pas + '</h2>'
            + '<div class="mission-meta">'
            + '<span class="meta-pill">Decisión ' + (this.round + 1) + '/4</span>'
            + '<span class="meta-pill">' + this.decisionScore + '/8 pts</span>'
            + '</div></div>'
            + '<div class="m5-layout">'
            + this.renderScenePanel()
            + '<div class="m5-decision-panel">'
            + '<div class="m5-pas-stepper">' + this.renderPasStepper() + '</div>'
            + '<div class="m5-context">' + decision.context + '</div>'
            + '<p class="m5-question">' + decision.question + '</p>'
            + '<div class="m5-options" id="m5-options">' + optionsHtml + '</div>'
            + '<div class="m5-feedback" id="m5-feedback"></div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m5-back">Salir al mapa</button>'
            + '<button type="button" class="btn-primary" id="m5-next" disabled>Continuar</button>'
            + '</div></div></div></div>';

        document.getElementById('m5-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        document.getElementById('m5-next').addEventListener('click', function () {
            GameAudio.click();
            self.round++;
            self.locked = false;
            self.renderDecision();
        });

        this.container.querySelectorAll('.m5-option').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (self.locked) return;
                self.handleChoice(parseInt(btn.getAttribute('data-index'), 10), btn);
            });
        });
    },

    handleChoice: function (optionIndex, btnEl) {
        var self = this;
        var decision = GAME_DATA.mission5.decisions[this.round];
        var option = decision.options[optionIndex];
        var feedback = document.getElementById('m5-feedback');
        var nextBtn = document.getElementById('m5-next');

        this.locked = true;
        this.decisionScore += option.points;
        this.missionPoints += option.points;
        this.history.push({ round: this.round, type: option.type });

        if (option.type === 'safe' || option.type === 'partial') {
            this.statusDone[decision.pasKey] = true;
        }

        this.container.querySelectorAll('.m5-option').forEach(function (b) {
            b.disabled = true;
        });
        btnEl.classList.add('is-selected');

        feedback.className = 'm5-feedback is-show is-' + option.type;
        feedback.innerHTML = '<strong>' + option.label + '</strong> ' + option.feedback;

        if (option.type === 'safe') GameAudio.success();
        else if (option.type === 'partial') GameAudio.partial();
        else {
            this.missionPoints = GameState.applyPenalty(this.missionPoints, 1);
            GameAudio.error();
        }

        this.updateSceneVisuals();
        GameUI.updateHud(this.missionPoints);
        nextBtn.disabled = false;
        nextBtn.focus();
    },

    updateSceneVisuals: function () {
        var panel = this.container.querySelector('.m5-scene-panel');
        if (panel) {
            panel.outerHTML = this.renderScenePanel();
        }
    },

    getScoreMessage: function () {
        var msgs = GAME_DATA.mission5.scoreMessages;
        if (this.decisionScore >= 7) return msgs.high;
        if (this.decisionScore >= 4) return msgs.mid;
        return msgs.low;
    },

    renderFinal: function () {
        var self = this;
        var bonus = this.decisionScore >= 7 ? 4 : this.decisionScore >= 5 ? 2 : this.decisionScore >= 2 ? 1 : 0;
        this.missionPoints += bonus;

        var keysHtml = GAME_DATA.mission5.keyIdeas.map(function (idea) {
            return '<li><span class="m5-key-check">OK</span><span>' + idea + '</span></li>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-5 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 5: Recorrido finalizado</h2>'
            + '<div class="mission-meta"><span class="meta-pill">Simulación completa</span></div>'
            + '</div>'
            + '<div class="m5-final-score animate-in">'
            + '<p style="margin:0 0 6px;opacity:0.9">Puntaje de decisiones</p>'
            + '<p class="m5-final-score-num">' + this.decisionScore + '/8</p>'
            + '</div>'
            + '<p class="screen-subtitle" style="text-align:center">' + this.getScoreMessage() + '</p>'
            + '<p style="text-align:center;color:var(--c-muted)">Total misión: <strong>' + this.missionPoints + '</strong> puntos formativos (incluye bonus de cierre).</p>'
            + '<h3 style="color:var(--c-teal-dark);margin:18px 0 10px">Ideas clave</h3>'
            + '<ul class="m5-key-list">' + keysHtml + '</ul>'
            + '<div class="m5-reflection">'
            + '<label for="m5-reflection">' + GAME_DATA.mission5.reflectionPrompt + '</label>'
            + '<textarea id="m5-reflection" placeholder="Escribí tu reflexión personal. No se guarda automáticamente."></textarea>'
            + '<small>Esta respuesta es para reflexión personal. Podés compartirla luego en el foro del LMS.</small>'
            + '</div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m5-retry">Volver a intentar</button>'
            + '<button type="button" class="btn-primary" id="m5-done">Continuar al mapa</button>'
            + '</div></div>';

        GameAudio.unlock();

        document.getElementById('m5-retry').addEventListener('click', function () {
            GameAudio.click();
            self.restartMission();
        });

        document.getElementById('m5-done').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.completeCurrentMission(self.missionPoints);
        });
    }
};

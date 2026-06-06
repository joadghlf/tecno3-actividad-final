var Mission1 = {
    container: null,
    phase: 'intro',
    round: 0,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    missionPoints: 0,
    conceptsLit: 0,
    locked: false,

    start: function (container) {
        this.container = container;
        this.phase = 'intro';
        this.round = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.correct = 0;
        this.missionPoints = 0;
        this.conceptsLit = 0;
        this.locked = false;
        this.renderIntro();
    },

    renderIntro: function () {
        var self = this;
        var chips = GAME_DATA.mission1.concepts.map(function (c) {
            return ''
                + '<button type="button" class="concept-chip" data-concept="' + c.id + '">'
                + '<span class="concept-chip-icon">' + c.title.charAt(0) + '</span>'
                + '<span><strong>' + c.title + '</strong><br><small>' + c.text + '</small></span>'
                + '</button>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-1 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 1: Clasificador en movimiento</h2>'
            + '<div class="mission-meta"><span class="meta-pill">Fase: Calentamiento</span></div>'
            + '</div>'
            + '<p class="mission-phase-label">Activá los conceptos clave</p>'
            + '<p class="screen-subtitle">Tocá cada tarjeta para cargarla. Cuando las tres brillen, arranca el desafío.</p>'
            + '<div class="m1-intro-beat">' + chips + '</div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m1-back">Volver al mapa</button>'
            + '<button type="button" class="btn-primary" id="m1-go" disabled>Iniciar oleada</button>'
            + '</div>'
            + '</div>';

        this.container.querySelectorAll('.concept-chip').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (btn.classList.contains('is-lit')) return;
                GameAudio.click();
                btn.classList.add('is-lit');
                self.conceptsLit++;
                if (self.conceptsLit >= GAME_DATA.mission1.concepts.length) {
                    document.getElementById('m1-go').disabled = false;
                    GameAudio.unlock();
                }
            });
        });

        document.getElementById('m1-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        document.getElementById('m1-go').addEventListener('click', function () {
            GameAudio.click();
            self.phase = 'play';
            self.renderRound();
        });
    },

    renderRound: function () {
        var self = this;
        var total = GAME_DATA.mission1.situations.length;
        var situation = GAME_DATA.mission1.situations[this.round];

        if (!situation) {
            this.renderVictory();
            return;
        }

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-1 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 1: Clasificador en movimiento</h2>'
            + '<div class="mission-meta">'
            + '<span class="meta-pill">Ola ' + (this.round + 1) + '/' + total + '</span>'
            + '<span class="meta-pill' + (this.streak >= 2 ? ' is-hot' : '') + '" id="m1-streak">Racha: ' + this.streak + '</span>'
            + '</div>'
            + '</div>'
            + '<p class="mission-phase-label">¿Es urgencia o emergencia?</p>'
            + '<div class="m1-stage">'
            + '<div class="m1-card-slot">'
            + '<div class="situation-card is-enter" id="m1-card">'
            + '<div class="situation-icon">'
            + '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">'
            + '<path d="M12 9v4m0 4h.01M10.3 4.2 2.7 17.5A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.5L13.7 4.2a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
            + '</svg></div>'
            + '<h3>' + situation.title + '</h3>'
            + '<p>' + situation.text + '</p>'
            + '</div></div></div>'
            + '<div class="portal-row">'
            + '<button type="button" class="portal-btn portal-urgency" data-answer="urgencia">'
            + '<strong>Urgencia</strong><span>Atención necesaria, sin riesgo vital inmediato.</span></button>'
            + '<button type="button" class="portal-btn portal-emergency" data-answer="emergencia">'
            + '<strong>Emergencia</strong><span>Riesgo vital. Activar ayuda ya.</span></button>'
            + '</div>'
            + '<div class="m1-feedback" id="m1-feedback"></div>'
            + '<p class="mission-help">Tip: en duda, priorizá proteger la escena y pedir ayuda a tiempo.</p>'
            + '<div class="screen-actions"><button type="button" class="btn-secondary" id="m1-back">Salir al mapa</button></div>'
            + '</div>';

        document.getElementById('m1-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        this.container.querySelectorAll('[data-answer]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (self.locked) return;
                self.handleAnswer(btn.getAttribute('data-answer'), btn.classList.contains('portal-emergency'));
            });
        });
    },

    handleAnswer: function (answer, isEmergencyPortal) {
        var self = this;
        var situation = GAME_DATA.mission1.situations[this.round];
        var card = document.getElementById('m1-card');
        var feedback = document.getElementById('m1-feedback');
        var isCorrect = answer === situation.type;

        this.locked = true;
        this.container.querySelectorAll('[data-answer]').forEach(function (b) { b.disabled = true; });

        feedback.className = 'm1-feedback is-show ' + (isCorrect ? 'is-ok' : 'is-bad');
        feedback.textContent = isCorrect ? ('+2 puntos · ' + situation.feedback) : ('Repasá: ' + situation.feedback);

        if (isCorrect) {
            this.correct++;
            this.streak++;
            this.missionPoints += 2;
            if (this.streak > this.bestStreak) this.bestStreak = this.streak;
            if (this.streak >= 2) {
                this.missionPoints += 1;
                feedback.textContent += ' · Bonus de racha +1';
            }
            GameAudio.success();
            card.classList.add(isEmergencyPortal ? 'is-exit-right' : 'is-exit-left');
        } else {
            this.streak = 0;
            GameAudio.error();
            card.classList.add('is-shake');
        }

        GameUI.updateHud();

        setTimeout(function () {
            self.locked = false;
            self.round++;
            self.renderRound();
        }, isCorrect ? 1100 : 1600);
    },

    renderVictory: function () {
        var self = this;
        var bonus = this.correct >= 5 ? 4 : 2;
        this.missionPoints += bonus;

        this.container.innerHTML = ''
            + '<div class="mission-victory animate-in">'
            + '<div class="mission-victory-burst">' + this.correct + '</div>'
            + '<h3>Oleada completada</h3>'
            + '<p>Clasificaste <strong>' + this.correct + '</strong> situaciones correctamente.'
            + ' Mejor racha: <strong>' + this.bestStreak + '</strong>.'
            + ' Sumaste <strong>' + this.missionPoints + '</strong> puntos formativos.</p>'
            + '<div class="screen-actions" style="justify-content:center">'
            + '<button type="button" class="btn-primary" id="m1-done">Continuar al mapa</button>'
            + '</div></div>';

        GameAudio.unlock();

        document.getElementById('m1-done').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.completeCurrentMission(self.missionPoints);
        });
    }
};

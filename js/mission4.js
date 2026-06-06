var Mission4 = {
    container: null,
    phase: 'scene',
    risksFound: [],
    selectedPerson: null,
    infoChecked: {},
    missionPoints: 0,
    locked: false,

    start: function (container) {
        this.container = container;
        this.phase = 'scene';
        this.risksFound = [];
        this.selectedPerson = null;
        this.infoChecked = {};
        this.missionPoints = 0;
        this.locked = false;
        this.renderScenePhase();
    },

    getHazardVisual: function (type) {
        if (type === 'bottle') {
            return ''
                + '<svg viewBox="0 0 32 32" aria-hidden="true">'
                + '<path fill="currentColor" d="M14 4h4v4l2 6v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V14l2-6V4z"/>'
                + '<path stroke="currentColor" stroke-width="2" d="M8 18l16 8"/>'
                + '</svg>';
        }
        if (type === 'chair') {
            return ''
                + '<svg viewBox="0 0 32 32" aria-hidden="true">'
                + '<rect fill="currentColor" x="6" y="14" width="18" height="4" rx="1" transform="rotate(-25 15 16)"/>'
                + '<rect fill="currentColor" x="10" y="20" width="3" height="8" transform="rotate(-25 11.5 24)"/>'
                + '<rect fill="currentColor" x="20" y="18" width="3" height="8" transform="rotate(-25 21.5 22)"/>'
                + '</svg>';
        }
        return ''
            + '<svg viewBox="0 0 32 32" aria-hidden="true">'
            + '<circle fill="currentColor" cx="10" cy="12" r="4"/>'
            + '<circle fill="currentColor" cx="16" cy="10" r="4"/>'
            + '<circle fill="currentColor" cx="22" cy="12" r="4"/>'
            + '<path fill="currentColor" d="M6 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0v8H6v-8z"/>'
            + '</svg>';
    },

    renderScenePhase: function () {
        var self = this;
        var total = GAME_DATA.mission4.sceneRisks.length;

        var hazardsHtml = GAME_DATA.mission4.sceneRisks.map(function (r) {
            return ''
                + '<button type="button" class="club-hazard" data-risk="' + r.id + '" '
                + 'aria-label="Evaluar riesgo: ' + r.shortName + '">'
                + '<span class="club-hazard-alert" aria-hidden="true">!</span>'
                + '<div class="club-hazard-visual">' + Mission4.getHazardVisual(r.visual) + '</div>'
                + '<span class="club-hazard-name">' + r.shortName + '</span>'
                + '<span class="club-hazard-clue">' + r.clue + '</span>'
                + '</button>';
        }).join('');

        var legendHtml = GAME_DATA.mission4.sceneRisks.map(function (r) {
            return '<li data-legend="' + r.id + '">Por encontrar: ' + r.shortName + '</li>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-4 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 4: Escena del club</h2>'
            + '<div class="mission-meta">'
            + '<span class="meta-pill">Fase 1 de 3</span>'
            + '<span class="meta-pill" id="m4-risk-count">0/' + total + '</span>'
            + '</div></div>'
            + '<div class="m2-progress-dots">'
            + '<div class="m2-dot is-active"></div><div class="m2-dot"></div><div class="m2-dot"></div>'
            + '</div>'
            + '<p class="mission-phase-label">Evaluá la escena</p>'
            + '<p class="screen-subtitle">Actividad en el club: alguien cayó mareado. Tocá cada tarjeta naranja con el signo <strong>!</strong> para identificar los riesgos.</p>'
            + '<div class="club-scene-v2" id="m4-scene">'
            + '<div class="club-scene-v2-header">Salón del club comunitario</div>'
            + '<div class="club-scene-v2-floor">'
            + '<div class="club-scene-v2-center">'
            + '<div class="club-victim-fig"></div>'
            + '<span class="club-victim-label">Persona mareada en el piso</span>'
            + '</div>'
            + '<div class="club-hazards-grid">' + hazardsHtml + '</div>'
            + '</div></div>'
            + '<ul class="club-scene-legend" id="m4-legend">' + legendHtml + '</ul>'
            + '<p class="club-scene-hint">Hay <strong>' + total + ' riesgos</strong> señalados. Cada tarjeta muestra un peligro concreto: tocala para confirmarlo antes de intervenir.</p>'
            + '<div class="risk-found-list" id="m4-found"></div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m4-back">Volver al mapa</button>'
            + '</div></div>';

        document.getElementById('m4-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        this.container.querySelectorAll('.club-hazard').forEach(function (btn) {
            btn.addEventListener('click', function () {
                self.handleRiskClick(btn);
            });
        });
    },

    handleRiskClick: function (btn) {
        if (btn.classList.contains('is-found')) return;

        var riskId = btn.getAttribute('data-risk');
        if (!riskId) return;

        if (this.risksFound.indexOf(riskId) !== -1) return;

        var risk = null;
        var i;
        for (i = 0; i < GAME_DATA.mission4.sceneRisks.length; i++) {
            if (GAME_DATA.mission4.sceneRisks[i].id === riskId) {
                risk = GAME_DATA.mission4.sceneRisks[i];
                break;
            }
        }

        if (!risk) return;

        this.risksFound.push(riskId);
        btn.classList.add('is-found');
        btn.querySelector('.club-hazard-alert').textContent = 'OK';
        GameAudio.success();
        this.missionPoints += 3;

        var legendItem = this.container.querySelector('[data-legend="' + riskId + '"]');
        if (legendItem) {
            legendItem.classList.add('is-done');
            legendItem.textContent = 'Encontrado: ' + risk.shortName;
        }

        var list = document.getElementById('m4-found');
        var item = document.createElement('div');
        item.className = 'risk-found-item';
        item.textContent = risk.label + ' — ' + risk.hint;
        list.appendChild(item);

        document.getElementById('m4-risk-count').textContent = this.risksFound.length + '/' + GAME_DATA.mission4.sceneRisks.length;
        GameUI.updateHud();

        if (this.risksFound.length >= GAME_DATA.mission4.sceneRisks.length) {
            var self = this;
            setTimeout(function () {
                GameAudio.unlock();
                self.renderCallPhase();
            }, 700);
        }
    },

    renderCallPhase: function () {
        var self = this;
        this.phase = 'call';

        var peopleHtml = GAME_DATA.mission4.people.map(function (p) {
            return ''
                + '<button type="button" class="person-card" data-person="' + p.id + '">'
                + '<div class="person-avatar">' + p.name.charAt(0) + '</div>'
                + '<strong>' + p.name + '</strong>'
                + '<span>' + p.role + '</span>'
                + '</button>';
        }).join('');

        var infoHtml = GAME_DATA.mission4.callInfo.map(function (info, idx) {
            return ''
                + '<button type="button" class="info-chip" data-info="' + info.id + '">'
                + '<span class="info-chip-num">' + (idx + 1) + '</span>'
                + '<span><strong>' + info.label + '</strong><small>Ejemplo: ' + info.example + '</small></span>'
                + '</button>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-4 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 4: Central de ayuda</h2>'
            + '<div class="mission-meta"><span class="meta-pill">Fase 2 de 3</span></div>'
            + '</div>'
            + '<div class="m2-progress-dots">'
            + '<div class="m2-dot is-done"></div><div class="m2-dot is-active"></div><div class="m2-dot"></div>'
            + '</div>'
            + '<p class="mission-phase-label">Activá la ayuda</p>'
            + '<p class="screen-subtitle">Elegí a quién pedirle que llame. Después marcá toda la información que debe comunicar.</p>'
            + '<div class="call-panel">'
            + '<div class="people-row">' + peopleHtml + '</div>'
            + '<div class="m1-feedback" id="m4-person-feedback"></div>'
            + '<p class="mission-phase-label" style="margin-top:10px">Datos para el llamado</p>'
            + '<div class="info-builder" id="m4-info">' + infoHtml + '</div>'
            + '</div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m4-back">Volver al mapa</button>'
            + '<button type="button" class="btn-primary" id="m4-call-go" disabled>Continuar</button>'
            + '</div></div>';

        document.getElementById('m4-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        this.container.querySelectorAll('.person-card').forEach(function (card) {
            card.addEventListener('click', function () {
                self.pickPerson(card.getAttribute('data-person'));
            });
        });

        this.container.querySelectorAll('.info-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                self.toggleInfo(chip.getAttribute('data-info'), chip);
            });
        });

        document.getElementById('m4-call-go').addEventListener('click', function () {
            self.validateCallPhase();
        });
    },

    pickPerson: function (personId) {
        var person = null;
        var i;

        for (i = 0; i < GAME_DATA.mission4.people.length; i++) {
            if (GAME_DATA.mission4.people[i].id === personId) {
                person = GAME_DATA.mission4.people[i];
                break;
            }
        }

        if (!person) return;

        GameAudio.click();
        this.selectedPerson = personId;

        this.container.querySelectorAll('.person-card').forEach(function (card) {
            card.classList.remove('is-picked', 'is-wrong-pick');
            if (card.getAttribute('data-person') === personId) {
                card.classList.add(person.correct ? 'is-picked' : 'is-wrong-pick');
            }
        });

        var feedback = document.getElementById('m4-person-feedback');
        feedback.className = 'm1-feedback is-show ' + (person.correct ? 'is-ok' : 'is-bad');
        feedback.textContent = person.feedback;

        if (person.correct) {
            GameAudio.success();
            this.missionPoints += 4;
        } else {
            GameAudio.error();
        }

        this.checkCallReady();
        GameUI.updateHud();
    },

    toggleInfo: function (infoId, chipEl) {
        if (this.infoChecked[infoId]) {
            delete this.infoChecked[infoId];
            chipEl.classList.remove('is-active');
        } else {
            this.infoChecked[infoId] = true;
            chipEl.classList.add('is-active');
            GameAudio.click();
        }
        this.checkCallReady();
    },

    checkCallReady: function () {
        var personOk = false;
        var i;

        if (this.selectedPerson) {
            for (i = 0; i < GAME_DATA.mission4.people.length; i++) {
                if (GAME_DATA.mission4.people[i].id === this.selectedPerson && GAME_DATA.mission4.people[i].correct) {
                    personOk = true;
                    break;
                }
            }
        }

        var infoCount = Object.keys(this.infoChecked).length;
        var btn = document.getElementById('m4-call-go');
        if (btn) btn.disabled = !(personOk && infoCount >= GAME_DATA.mission4.callInfo.length);
    },

    validateCallPhase: function () {
        var infoCount = Object.keys(this.infoChecked).length;
        this.missionPoints += infoCount * 1;
        GameAudio.unlock();
        this.renderFinalPhase();
    },

    renderFinalPhase: function () {
        var self = this;
        this.phase = 'final';
        this.locked = false;

        var choicesHtml = GAME_DATA.mission4.finalChoices.map(function (c, idx) {
            return ''
                + '<button type="button" class="final-choice-btn" data-choice="' + idx + '">' + c.text + '</button>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-4 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 4: Socorrer con calma</h2>'
            + '<div class="mission-meta"><span class="meta-pill">Fase 3 de 3</span></div>'
            + '</div>'
            + '<div class="m2-progress-dots">'
            + '<div class="m2-dot is-done"></div><div class="m2-dot is-done"></div><div class="m2-dot is-active"></div>'
            + '</div>'
            + '<p class="mission-phase-label">Decisión final</p>'
            + '<p class="screen-subtitle">La escena está más ordenada y ya se pidió ayuda. ¿Qué hacés ahora?</p>'
            + '<div id="m4-choices">' + choicesHtml + '</div>'
            + '<div class="m4-feedback" id="m4-final-feedback"></div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m4-back">Volver al mapa</button>'
            + '<button type="button" class="btn-primary" id="m4-finish" disabled>Completar misión</button>'
            + '</div></div>';

        document.getElementById('m4-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        this.container.querySelectorAll('.final-choice-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (self.locked) return;
                self.handleFinalChoice(parseInt(btn.getAttribute('data-choice'), 10), btn);
            });
        });

        document.getElementById('m4-finish').addEventListener('click', function () {
            self.renderVictory();
        });
    },

    handleFinalChoice: function (index, btnEl) {
        var choice = GAME_DATA.mission4.finalChoices[index];
        var feedback = document.getElementById('m4-final-feedback');
        this.locked = true;

        this.container.querySelectorAll('.final-choice-btn').forEach(function (b) {
            b.disabled = true;
        });

        btnEl.classList.add(choice.type === 'safe' ? 'is-picked-safe' : 'is-picked-risk');

        feedback.className = 'm4-feedback is-show';
        feedback.style.background = choice.type === 'safe' ? 'var(--c-green-light)' : 'var(--c-red-light)';
        feedback.style.borderLeft = '6px solid ' + (choice.type === 'safe' ? 'var(--c-green)' : 'var(--c-red)');
        feedback.textContent = choice.feedback;

        this.missionPoints += choice.points;

        if (choice.type === 'safe') {
            GameAudio.success();
        } else {
            GameAudio.error();
        }

        document.getElementById('m4-finish').disabled = false;
        GameUI.updateHud();
    },

    renderVictory: function () {
        var self = this;
        this.missionPoints += 3;

        this.container.innerHTML = ''
            + '<div class="mission-victory animate-in">'
            + '<div class="mission-victory-burst">SOS</div>'
            + '<h3>Escena bajo control</h3>'
            + '<p>Evaluaste riesgos, activaste ayuda y elegiste una acción segura. Sumaste <strong>' + this.missionPoints + '</strong> puntos formativos.</p>'
            + '<div class="screen-actions" style="justify-content:center">'
            + '<button type="button" class="btn-primary" id="m4-done">Continuar al mapa</button>'
            + '</div></div>';

        GameAudio.unlock();

        document.getElementById('m4-done').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.completeCurrentMission(self.missionPoints);
        });
    }
};

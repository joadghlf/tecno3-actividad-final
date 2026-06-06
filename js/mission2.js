var Mission2 = {
    container: null,
    phase: 'kit',
    kitStored: [],
    risksFound: [],
    wrongClicks: 0,
    missionPoints: 0,
    dragItem: null,
    dragOffset: { x: 0, y: 0 },

    start: function (container) {
        this.container = container;
        this.phase = 'kit';
        this.kitStored = [];
        this.risksFound = [];
        this.wrongClicks = 0;
        this.missionPoints = 0;
        this.renderKitPhase();
    },

    renderKitPhase: function () {
        var self = this;
        var items = this.shuffle(GAME_DATA.mission2.kitItems.slice());

        var poolHtml = items.map(function (item) {
            return '<div class="pool-item" draggable="true" data-id="' + item.id + '" data-correct="' + item.correct + '">' + item.label + '</div>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-2 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 2: Botiquín express</h2>'
            + '<div class="mission-meta">'
            + '<span class="meta-pill">Fase 1 de 2</span>'
            + '<span class="meta-pill" id="m2-kit-count">0/' + GAME_DATA.mission2.kitRequired + '</span>'
            + '</div></div>'
            + '<div class="m2-progress-dots">'
            + '<div class="m2-dot is-active"></div><div class="m2-dot"></div>'
            + '</div>'
            + '<p class="mission-phase-label">Armá el botiquín</p>'
            + '<p class="screen-subtitle">Arrastrá (o tocá y tocá la mochila) solo los elementos que sí van en un botiquín básico.</p>'
            + '<div class="kit-arena">'
            + '<div class="items-pool" id="m2-pool">' + poolHtml + '</div>'
            + '<div class="kit-bag-zone" id="m2-bag">'
            + '<div class="kit-bag-icon">'
            + '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
            + '<path d="M6 7h12l1 14H5L6 7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
            + '<path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="2"/>'
            + '</svg></div>'
            + '<p>Soltá acá los elementos correctos</p>'
            + '<div class="kit-stored" id="m2-stored"></div>'
            + '</div></div>'
            + '<p class="mission-help">En celular: tocá un ítem y después tocá la mochila.</p>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m2-back">Volver al mapa</button>'
            + '</div></div>';

        document.getElementById('m2-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        this.setupKitInteractions();
    },

    setupKitInteractions: function () {
        var self = this;
        var pool = document.getElementById('m2-pool');
        var bag = document.getElementById('m2-bag');
        var selected = null;

        pool.querySelectorAll('.pool-item').forEach(function (el) {
            el.addEventListener('dragstart', function (e) {
                if (el.classList.contains('is-placed')) return;
                self.dragItem = el;
                el.classList.add('is-dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            el.addEventListener('dragend', function () {
                el.classList.remove('is-dragging');
                self.dragItem = null;
            });

            el.addEventListener('click', function () {
                if (el.classList.contains('is-placed')) return;
                GameAudio.click();
                pool.querySelectorAll('.pool-item').forEach(function (p) { p.classList.remove('is-tap-selected'); });
                el.classList.add('is-tap-selected');
                selected = el;
            });
        });

        bag.addEventListener('dragover', function (e) {
            e.preventDefault();
            bag.classList.add('is-hover');
        });

        bag.addEventListener('dragleave', function () {
            bag.classList.remove('is-hover');
        });

        bag.addEventListener('drop', function (e) {
            e.preventDefault();
            bag.classList.remove('is-hover');
            if (self.dragItem) self.tryPlaceItem(self.dragItem);
        });

        bag.addEventListener('click', function () {
            if (selected && !selected.classList.contains('is-placed')) {
                self.tryPlaceItem(selected);
                selected.classList.remove('is-tap-selected');
                selected = null;
            }
        });
    },

    tryPlaceItem: function (el) {
        var id = el.getAttribute('data-id');
        var isCorrect = el.getAttribute('data-correct') === 'true';

        if (this.kitStored.indexOf(id) !== -1) return;

        if (!isCorrect) {
            el.classList.add('is-wrong-flash');
            GameAudio.error();
            this.wrongClicks++;
            return;
        }

        this.kitStored.push(id);
        el.classList.add('is-placed');
        GameAudio.success();
        this.missionPoints += 2;

        var stored = document.getElementById('m2-stored');
        var tag = document.createElement('span');
        tag.className = 'kit-stored-item';
        tag.textContent = el.textContent;
        stored.appendChild(tag);

        document.getElementById('m2-kit-count').textContent = this.kitStored.length + '/' + GAME_DATA.mission2.kitRequired;
        GameUI.updateHud();

        if (this.kitStored.length >= GAME_DATA.mission2.kitRequired) {
            var self = this;
            setTimeout(function () {
                self.missionPoints += 4;
                GameAudio.unlock();
                self.renderRiskPhase();
            }, 700);
        }
    },

    renderRiskPhase: function () {
        var self = this;
        this.phase = 'risk';
        var total = GAME_DATA.mission2.risks.length;

        var hazardsHtml = GAME_DATA.mission2.risks.map(function (r) {
            return ''
                + '<button type="button" class="club-hazard" data-risk="' + r.id + '" '
                + 'aria-label="Evaluar riesgo: ' + r.shortName + '">'
                + '<span class="club-hazard-alert" aria-hidden="true">!</span>'
                + '<div class="club-hazard-visual">' + Mission2.getHazardVisual(r.visual) + '</div>'
                + '<span class="club-hazard-name">' + r.shortName + '</span>'
                + '<span class="club-hazard-clue">' + r.clue + '</span>'
                + '</button>';
        }).join('');

        var legendHtml = GAME_DATA.mission2.risks.map(function (r) {
            return '<li data-legend="' + r.id + '">Por encontrar: ' + r.shortName + '</li>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-2 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 2: Radar de riesgos</h2>'
            + '<div class="mission-meta">'
            + '<span class="meta-pill">Fase 2 de 2</span>'
            + '<span class="meta-pill" id="m2-risk-count">0/' + total + '</span>'
            + '</div></div>'
            + '<div class="m2-progress-dots">'
            + '<div class="m2-dot is-done"></div><div class="m2-dot is-active"></div>'
            + '</div>'
            + '<p class="mission-phase-label">Escaneá la escena</p>'
            + '<p class="screen-subtitle">Plaza comunitaria: tocá cada tarjeta naranja con el signo <strong>!</strong> para identificar los riesgos evitables.</p>'
            + '<div class="club-scene-v2 plaza-scene-v2" id="m2-scene">'
            + '<div class="club-scene-v2-header">Plaza comunitaria</div>'
            + '<div class="club-scene-v2-floor plaza-scene-v2-floor">'
            + '<div class="club-hazards-grid">' + hazardsHtml + '</div>'
            + '</div></div>'
            + '<ul class="club-scene-legend" id="m2-legend">' + legendHtml + '</ul>'
            + '<p class="club-scene-hint">Hay <strong>' + total + ' riesgos</strong> señalados en la plaza. Tocá cada tarjeta para confirmarlo.</p>'
            + '<div class="risk-found-list" id="m2-found"></div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m2-back">Volver al mapa</button>'
            + '</div></div>';

        document.getElementById('m2-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        this.container.querySelectorAll('.club-hazard').forEach(function (btn) {
            btn.addEventListener('click', function () {
                self.handleRiskClick(btn);
            });
        });
    },

    getHazardVisual: function (type) {
        if (type === 'vereda') {
            return ''
                + '<svg viewBox="0 0 32 32" aria-hidden="true">'
                + '<rect fill="currentColor" x="4" y="18" width="24" height="10" rx="1"/>'
                + '<path stroke="currentColor" stroke-width="2" d="M8 22h6M18 20l4 4"/>'
                + '<path fill="currentColor" d="M14 16l3 6H11l3-6z"/>'
                + '</svg>';
        }
        if (type === 'cable') {
            return ''
                + '<svg viewBox="0 0 32 32" aria-hidden="true">'
                + '<path fill="none" stroke="currentColor" stroke-width="3" d="M6 8c8 6 12 10 20 16"/>'
                + '<circle fill="currentColor" cx="24" cy="22" r="3"/>'
                + '<path fill="currentColor" d="M4 24h8v4H4z"/>'
                + '</svg>';
        }
        return ''
            + '<svg viewBox="0 0 32 32" aria-hidden="true">'
            + '<ellipse fill="currentColor" opacity="0.35" cx="16" cy="22" rx="12" ry="4"/>'
            + '<path fill="currentColor" d="M10 14c2-4 10-4 12 0v2H10v-2z"/>'
            + '<path stroke="currentColor" stroke-width="2" d="M8 18h16"/>'
            + '</svg>';
    },

    handleRiskClick: function (btn) {
        if (btn.classList.contains('is-found')) return;

        var riskId = btn.getAttribute('data-risk');
        if (!riskId) return;

        if (this.risksFound.indexOf(riskId) !== -1) return;

        var risk = GAME_DATA.mission2.risks.filter(function (r) { return r.id === riskId; })[0];
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

        var list = document.getElementById('m2-found');
        var item = document.createElement('div');
        item.className = 'risk-found-item';
        item.textContent = risk.label + ' — ' + risk.hint;
        list.appendChild(item);

        document.getElementById('m2-risk-count').textContent = this.risksFound.length + '/' + GAME_DATA.mission2.risks.length;
        GameUI.updateHud();

        if (this.risksFound.length >= GAME_DATA.mission2.risks.length) {
            var self = this;
            setTimeout(function () { self.renderVictory(); }, 800);
        }
    },

    renderVictory: function () {
        var self = this;
        var bonus = this.wrongClicks === 0 ? 4 : 2;
        this.missionPoints += bonus;

        this.container.innerHTML = ''
            + '<div class="mission-victory animate-in">'
            + '<div class="mission-victory-burst">OK</div>'
            + '<h3>Misión 2 completada</h3>'
            + '<p>Botiquín armado y riesgos detectados. Sumaste <strong>' + this.missionPoints + '</strong> puntos formativos.'
            + (this.wrongClicks === 0 ? ' Sin errores: bonus perfecto.' : '') + '</p>'
            + '<div class="screen-actions" style="justify-content:center">'
            + '<button type="button" class="btn-primary" id="m2-done">Continuar al mapa</button>'
            + '</div></div>';

        GameAudio.unlock();

        document.getElementById('m2-done').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.completeCurrentMission(self.missionPoints);
        });
    },

    shuffle: function (arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
        return arr;
    }
};

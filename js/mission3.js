var Mission3 = {
    container: null,
    phase: 'order',
    orderItems: [],
    placedActions: {},
    selectedAction: null,
    missionPoints: 0,
    attempts: 0,

    start: function (container) {
        this.container = container;
        this.phase = 'order';
        this.placedActions = {};
        this.selectedAction = null;
        this.missionPoints = 0;
        this.attempts = 0;
        this.orderItems = this.shuffle(GAME_DATA.mission3.steps.slice());
        this.renderOrderPhase();
    },

    renderOrderPhase: function () {
        var self = this;
        var total = this.orderItems.length;

        var listHtml = this.orderItems.map(function (item, index) {
            var upDisabled = index === 0 ? ' disabled aria-disabled="true"' : '';
            var downDisabled = index === total - 1 ? ' disabled aria-disabled="true"' : '';

            return ''
                + '<div class="pas-order-item" draggable="true" data-idx="' + index + '" data-id="' + item.id + '">'
                + '<span class="pas-order-handle" aria-hidden="true" title="Arrastrar para reordenar"></span>'
                + '<span class="pas-order-position">' + (index + 1) + '</span>'
                + '<span class="pas-order-letter">' + item.letter + '</span>'
                + '<div class="pas-order-text"><strong>' + item.title + '</strong><small>' + item.text + '</small></div>'
                + '<div class="pas-order-moves">'
                + '<button type="button" class="btn-move btn-move-up" data-dir="up" data-idx="' + index + '" aria-label="Subir un lugar"' + upDisabled + '>'
                + '<span class="btn-move-icon" aria-hidden="true">▲</span><span class="btn-move-label">Subir</span>'
                + '</button>'
                + '<button type="button" class="btn-move btn-move-down" data-dir="down" data-idx="' + index + '" aria-label="Bajar un lugar"' + downDisabled + '>'
                + '<span class="btn-move-icon" aria-hidden="true">▼</span><span class="btn-move-label">Bajar</span>'
                + '</button>'
                + '</div></div>';
        }).join('');

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-3 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 3: Cadena PAS</h2>'
            + '<div class="mission-meta"><span class="meta-pill">Fase 1 de 2</span></div>'
            + '</div>'
            + '<div class="m2-progress-dots"><div class="m2-dot is-active"></div><div class="m2-dot"></div></div>'
            + '<p class="mission-phase-label">Ordená el protocolo</p>'
            + '<p class="screen-subtitle">Dejá los pasos en este orden: <strong>1 Proteger → 2 Avisar → 3 Socorrer</strong>.</p>'
            + '<p class="pas-order-hint">Arrastrá las tarjetas por el agarre <span class="pas-order-hint-grip" aria-hidden="true"></span> o usá los botones <strong>Subir</strong> / <strong>Bajar</strong>.</p>'
            + '<div class="pas-chain" id="m3-order-list">' + listHtml + '</div>'
            + '<div class="pas-chain-complete" id="m3-chain-preview">'
            + '<span class="pas-chain-node">1 · P</span><span class="pas-chain-arrow">→</span>'
            + '<span class="pas-chain-node">2 · A</span><span class="pas-chain-arrow">→</span>'
            + '<span class="pas-chain-node">3 · S</span>'
            + '</div>'
            + '<div class="m1-feedback" id="m3-order-feedback"></div>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m3-back">Volver al mapa</button>'
            + '<button type="button" class="btn-primary" id="m3-check-order">Confirmar orden</button>'
            + '</div></div>';

        document.getElementById('m3-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        this.container.querySelectorAll('.btn-move').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (btn.disabled) return;
                var idx = parseInt(btn.getAttribute('data-idx'), 10);
                var dir = btn.getAttribute('data-dir');
                self.moveOrderItem(idx, dir);
            });
        });

        this.setupOrderDrag();

        document.getElementById('m3-check-order').addEventListener('click', function () {
            self.checkOrder();
        });
    },

    setupOrderDrag: function () {
        var self = this;
        var list = document.getElementById('m3-order-list');
        if (!list) return;

        var dragIndex = null;

        list.querySelectorAll('.pas-order-item').forEach(function (item) {
            item.addEventListener('dragstart', function (e) {
                dragIndex = parseInt(item.getAttribute('data-idx'), 10);
                item.classList.add('is-dragging');
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(dragIndex));
                }
            });

            item.addEventListener('dragend', function () {
                item.classList.remove('is-dragging');
                list.querySelectorAll('.pas-order-item').forEach(function (el) {
                    el.classList.remove('is-drag-over');
                });
                dragIndex = null;
            });

            item.addEventListener('dragover', function (e) {
                e.preventDefault();
                if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
                item.classList.add('is-drag-over');
            });

            item.addEventListener('dragleave', function () {
                item.classList.remove('is-drag-over');
            });

            item.addEventListener('drop', function (e) {
                e.preventDefault();
                item.classList.remove('is-drag-over');
                var dropIndex = parseInt(item.getAttribute('data-idx'), 10);
                if (dragIndex === null || dragIndex === dropIndex) return;
                self.reorderItems(dragIndex, dropIndex);
            });
        });
    },

    reorderItems: function (fromIndex, toIndex) {
        var item = this.orderItems.splice(fromIndex, 1)[0];
        this.orderItems.splice(toIndex, 0, item);
        GameAudio.click();
        this.renderOrderPhase();
    },

    moveOrderItem: function (index, dir) {
        var newIndex = dir === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= this.orderItems.length) return;

        GameAudio.click();
        var temp = this.orderItems[index];
        this.orderItems[index] = this.orderItems[newIndex];
        this.orderItems[newIndex] = temp;
        this.renderOrderPhase();
    },

    checkOrder: function () {
        var feedback = document.getElementById('m3-order-feedback');
        var correct = true;

        for (var i = 0; i < this.orderItems.length; i++) {
            if (this.orderItems[i].order !== i + 1) {
                correct = false;
                break;
            }
        }

        if (!correct) {
            this.attempts++;
            this.missionPoints = GameState.applyPenalty(this.missionPoints, 2);
            feedback.className = 'm1-feedback is-show is-bad';
            feedback.textContent = '−2 puntos · Todavía no es el orden PAS. Recordá: primero Proteger, después Avisar y por último Socorrer.';
            GameAudio.error();
            GameUI.updateHud(this.missionPoints);
            this.container.querySelectorAll('.pas-order-item').forEach(function (el) {
                el.classList.add('is-wrong-slot');
            });
            return;
        }

        GameAudio.success();
        this.missionPoints += 6;
        feedback.className = 'm1-feedback is-show is-ok';
        feedback.textContent = 'Cadena PAS correcta. La secuencia se enciende paso a paso.';

        var nodes = this.container.querySelectorAll('.pas-chain-node');
        nodes.forEach(function (node, i) {
            setTimeout(function () {
                node.classList.add('is-lit');
                GameAudio.click();
            }, i * 350);
        });

        var self = this;
        setTimeout(function () {
            GameAudio.unlock();
            self.renderClassifyPhase();
        }, 1200);
    },

    renderClassifyPhase: function () {
        var self = this;
        this.phase = 'classify';

        var zonesHtml = GAME_DATA.mission3.zones.map(function (z) {
            return ''
                + '<div class="pas-zone pas-zone-' + z.color + '" data-zone="' + z.id + '" id="zone-' + z.id + '">'
                + '<h4>' + z.label + '</h4>'
                + '<div class="pas-zone-items" id="zone-items-' + z.id + '"></div>'
                + '</div>';
        }).join('');

        var actions = this.shuffle(GAME_DATA.mission3.actions.slice());
        var poolHtml = actions.map(function (a) {
            if (self.placedActions[a.id]) return '';
            return '<div class="pas-action-chip" data-id="' + a.id + '" data-zone="' + a.zone + '">' + a.text + '</div>';
        }).join('');

        var placedCount = Object.keys(this.placedActions).length;

        this.container.innerHTML = ''
            + '<div class="mission-wrap mission-3 animate-in">'
            + '<div class="mission-top">'
            + '<h2>Misión 3: Clasificador PAS</h2>'
            + '<div class="mission-meta">'
            + '<span class="meta-pill">Fase 2 de 2</span>'
            + '<span class="meta-pill">' + placedCount + '/' + GAME_DATA.mission3.actions.length + '</span>'
            + '</div></div>'
            + '<div class="m2-progress-dots"><div class="m2-dot is-done"></div><div class="m2-dot is-active"></div></div>'
            + '<p class="mission-phase-label">Clasificá cada acción</p>'
            + '<p class="screen-subtitle">Tocá una acción y después la zona. Las acciones riesgosas van en Evitar.</p>'
            + '<div class="pas-actions-pool" id="m3-pool">' + poolHtml + '</div>'
            + '<div class="pas-zones-grid">' + zonesHtml + '</div>'
            + '<p class="mission-help">Tip: si dudás, pensá si la acción protege, avisa, socorre o conviene evitarla.</p>'
            + '<div class="screen-actions">'
            + '<button type="button" class="btn-secondary" id="m3-back">Volver al mapa</button>'
            + '</div></div>';

        document.getElementById('m3-back').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.goToMap();
        });

        this.setupClassifyInteractions();
    },

    setupClassifyInteractions: function () {
        var self = this;
        var pool = document.getElementById('m3-pool');

        if (!pool) return;

        pool.querySelectorAll('.pas-action-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                GameAudio.click();
                pool.querySelectorAll('.pas-action-chip').forEach(function (c) {
                    c.classList.remove('is-selected');
                });
                chip.classList.add('is-selected');
                self.selectedAction = chip.getAttribute('data-id');
            });
        });

        this.container.querySelectorAll('.pas-zone').forEach(function (zone) {
            zone.addEventListener('click', function () {
                if (!self.selectedAction) return;
                self.placeAction(self.selectedAction, zone.getAttribute('data-zone'));
            });
        });
    },

    placeAction: function (actionId, zoneId) {
        var action = null;
        var i;

        for (i = 0; i < GAME_DATA.mission3.actions.length; i++) {
            if (GAME_DATA.mission3.actions[i].id === actionId) {
                action = GAME_DATA.mission3.actions[i];
                break;
            }
        }

        if (!action || this.placedActions[actionId]) return;

        var zoneEl = document.getElementById('zone-items-' + zoneId);
        var isCorrect = action.zone === zoneId;

        if (!isCorrect) {
            GameAudio.error();
            this.attempts++;
            this.missionPoints = GameState.applyPenalty(this.missionPoints, 1);
            GameUI.updateHud(this.missionPoints);
            zoneEl.parentElement.classList.add('pas-zone-chip-wrong');
            setTimeout(function () {
                zoneEl.parentElement.classList.remove('pas-zone-chip-wrong');
            }, 450);
            return;
        }

        this.placedActions[actionId] = zoneId;
        this.selectedAction = null;
        GameAudio.success();
        this.missionPoints += 2;

        var tag = document.createElement('div');
        tag.className = 'pas-action-chip is-placed';
        tag.textContent = action.text;
        zoneEl.appendChild(tag);

        var chip = this.container.querySelector('[data-id="' + actionId + '"]');
        if (chip) chip.remove();

        GameUI.updateHud(this.missionPoints);

        if (Object.keys(this.placedActions).length >= GAME_DATA.mission3.actions.length) {
            var self = this;
            setTimeout(function () { self.renderVictory(); }, 600);
        }
    },

    renderVictory: function () {
        var self = this;
        var bonus = this.attempts === 0 ? 4 : this.attempts <= 3 ? 2 : 0;
        this.missionPoints += bonus;

        this.container.innerHTML = ''
            + '<div class="mission-victory animate-in">'
            + '<div class="mission-victory-burst">PAS</div>'
            + '<h3>Cadena PAS dominada</h3>'
            + '<p>Ordenaste y clasificaste acciones correctamente. Sumaste <strong>' + this.missionPoints + '</strong> puntos formativos.</p>'
            + '<div class="screen-actions" style="justify-content:center">'
            + '<button type="button" class="btn-primary" id="m3-done">Continuar al mapa</button>'
            + '</div></div>';

        GameAudio.unlock();

        document.getElementById('m3-done').addEventListener('click', function () {
            GameAudio.click();
            GameEngine.completeCurrentMission(self.missionPoints);
        });
    },

    shuffle: function (arr) {
        var i = arr.length;
        var j;
        var t;

        while (i > 0) {
            j = Math.floor(Math.random() * i);
            i--;
            t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
        }
        return arr;
    }
};

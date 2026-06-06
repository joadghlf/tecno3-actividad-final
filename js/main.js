document.addEventListener('DOMContentLoaded', function () {
    GameUI.init();
    GameUI.refresh();

    var btnAudio = document.getElementById('btn-audio');
    GameAudio.setEnabled(GameState.audioEnabled);
    btnAudio.setAttribute('aria-pressed', GameState.audioEnabled ? 'true' : 'false');
    btnAudio.setAttribute('aria-label', GameState.audioEnabled ? 'Desactivar sonido' : 'Activar sonido');

    btnAudio.addEventListener('click', function () {
        var next = !GameAudio.isEnabled();
        GameAudio.setEnabled(next);
        GameState.audioEnabled = next;
        btnAudio.setAttribute('aria-pressed', next ? 'true' : 'false');
        btnAudio.setAttribute('aria-label', next ? 'Desactivar sonido' : 'Activar sonido');

        if (next) {
            GameAudio.click();
        }
    });
});

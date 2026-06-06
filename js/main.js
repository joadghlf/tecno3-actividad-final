document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var isEmbedded = window.self !== window.top || params.get('embed') === '1';

    if (isEmbedded) {
        document.documentElement.classList.add('is-embedded');
    }

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

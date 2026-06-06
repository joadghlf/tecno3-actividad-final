var GameAudio = (function () {
    var ctx = null;
    var enabled = true;

    function getContext() {
        if (!ctx) {
            var Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) ctx = new Ctx();
        }
        return ctx;
    }

    function playTone(freq, duration, type, volume) {
        if (!enabled) return;

        var audioCtx = getContext();
        if (!audioCtx) return;

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        var oscillator = audioCtx.createOscillator();
        var gain = audioCtx.createGain();

        oscillator.type = type || 'sine';
        oscillator.frequency.value = freq;
        gain.gain.value = volume || 0.06;

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        var now = audioCtx.currentTime;
        gain.gain.setValueAtTime(volume || 0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    return {
        setEnabled: function (value) {
            enabled = !!value;
            if (enabled) getContext();
        },

        isEnabled: function () {
            return enabled;
        },

        click: function () {
            playTone(520, 0.06, 'sine', 0.04);
        },

        success: function () {
            playTone(660, 0.08, 'sine', 0.05);
            setTimeout(function () { playTone(880, 0.1, 'sine', 0.04); }, 80);
        },

        partial: function () {
            playTone(440, 0.1, 'triangle', 0.04);
        },

        error: function () {
            playTone(220, 0.14, 'square', 0.035);
        },

        unlock: function () {
            playTone(523, 0.07, 'sine', 0.04);
            setTimeout(function () { playTone(784, 0.12, 'sine', 0.04); }, 70);
        }
    };
})();

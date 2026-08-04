// ui.js

// import
import { getTuningMessage } from "./tuner.js";

// Success tone (plays once when note becomes in tune)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let wasInTune = false;

function playInTuneTone() {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = 880; // A5 confirmation tone

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

export function updateDisplay(noteName, frequency, cents) {

    const noteEl = document.getElementById("note-display");
    const freqEl = document.getElementById("freq-display");
    const centsEl = document.getElementById("cents-display");
    const statusEl = document.getElementById("status-display");
    const meter = document.getElementById("meter-indicator");

    if (!noteName) {

        noteEl.innerText = "--";
        freqEl.innerText = "0.0 Hz";
        centsEl.innerText = "0¢";
        statusEl.innerText = "Listening...";

        statusEl.className = "status-display";
        meter.style.left = "50%";

        // Reset so the tone can play again next time
        wasInTune = false;

        return;
    }

    noteEl.innerText = noteName;
    freqEl.innerText = `${frequency.toFixed(2)} Hz`;
    centsEl.innerText = `${cents > 0 ? "+" : ""}${cents}¢`;

    statusEl.className = "status-display";

    if (Math.abs(cents) <= 5) {

        statusEl.innerText = "✓ In Tune!";
        statusEl.classList.add("status-tuned");

        // Play confirmation tone only once when entering the in-tune range
        if (!wasInTune) {
            playInTuneTone();
            wasInTune = true;
        }

    } else if (cents < 0) {

        wasInTune = false;

        statusEl.innerText = `Flat ${Math.abs(cents)}¢`;
        statusEl.classList.add("status-flat");

    } else {

        wasInTune = false;

        statusEl.innerText = `Sharp ${cents}¢`;
        statusEl.classList.add("status-sharp");

    }

    // Move tuning meter
    const clamped = Math.max(-50, Math.min(50, cents));

    // -50¢ -> 0%
    // 0¢   -> 50%
    // +50¢ -> 100%
    meter.style.left = `${50 + clamped}%`;
}
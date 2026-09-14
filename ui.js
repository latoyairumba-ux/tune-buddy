// ui.js

// Import
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
    gain.gain.exponentialRampToValueAtTime(
        0.15,
        audioCtx.currentTime + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.15
    );

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

    // No detected note
    if (!noteName) {

        noteEl.innerText = "--";
        freqEl.innerText = "0.0 Hz";
        centsEl.innerText = "0¢";
        statusEl.innerText = "Listening...";

        statusEl.className = "status-display";
        meter.style.left = "50%";

        // Allow the confirmation tone to play
        // when the next note becomes in tune
        wasInTune = false;

        return;
    }

    // Display detected note information
    noteEl.innerText = noteName;
    freqEl.innerText = `${frequency.toFixed(2)} Hz`;
    centsEl.innerText = `${cents > 0 ? "+" : ""}${cents}¢`;

    // Get tuning message and state from tuner.js
    const tuning = getTuningMessage(cents);

    // Display message
    statusEl.innerText = tuning.text;

    // Reset status classes
    statusEl.className = "status-display";

    // Apply the state returned by tuner.js
    if (tuning.state === "tuned") {

        statusEl.classList.add("status-tuned");

        // Play confirmation tone only once
        // when entering the in-tune range
        if (!wasInTune) {
            playInTuneTone();
            wasInTune = true;
        }

    } else if (tuning.state === "flat") {

        statusEl.classList.add("status-flat");
        wasInTune = false;

    } else if (tuning.state === "sharp") {

        statusEl.classList.add("status-sharp");
        wasInTune = false;

    } else if (tuning.state === "danger") {

        // More than 40 cents sharp
        statusEl.classList.add("status-danger");
        wasInTune = false;

    } else {

        // Neutral / Listening
        wasInTune = false;
    }

    // Move tuning meter
    // -50¢ -> 0%
    // 0¢   -> 50%
    // +50¢ -> 100%
    const clamped = Math.max(-50, Math.min(50, cents));
    meter.style.left = `${50 + clamped}%`;
}
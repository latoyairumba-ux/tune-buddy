// ui.js

// Import
import { getTuningMessage } from "./tuner.js";

// Success tone
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let wasInTune = false;

// Timer for keeping the display visible
let displayTimeout = null;

function playInTuneTone() {
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = 880;

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

        // Keep the last display visible for 15 seconds
        if (displayTimeout) {
            clearTimeout(displayTimeout);
        }

        displayTimeout = setTimeout(() => {

            noteEl.innerText = "--";
            freqEl.innerText = "0.0 Hz";
            centsEl.innerText = "0¢";
            statusEl.innerText = "Listening...";

            statusEl.className = "status-display";
            meter.style.left = "50%";

            wasInTune = false;

        }, 15000);

        return;
    }

    // A new note was detected, so cancel the previous timeout
    if (displayTimeout) {
        clearTimeout(displayTimeout);
        displayTimeout = null;
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

        statusEl.classList.add("status-danger");
        wasInTune = false;

    } else {

        wasInTune = false;
    }

    // Move tuning meter
    // -50¢ -> 0%
    // 0¢   -> 50%
    // +50¢ -> 100%
    const clamped = Math.max(-50, Math.min(50, cents));
    meter.style.left = `${50 + clamped}%`;
}
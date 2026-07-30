// ui.js
import { getTuningMessage } from "./tuner.js";

let soundPlayed = false;

// Synthesize a quick "in-tune" chime tone (880 Hz / A5)
function playInTuneSound() {
    if (soundPlayed) return; // Prevent repeated beeping

    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Pitch (A5)

        // Smooth volume decay
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);

        soundPlayed = true; // Mark played
    } catch (e) {
        console.error("Audio playback error:", e);
    }
}

export function updateDisplay(noteName, frequency, cents) {
    const noteEl = document.getElementById("note-display");
    const freqEl = document.getElementById("freq-display");
    const centsEl = document.getElementById("cents-display");
    const statusEl = document.getElementById("status-display");
    const meter = document.getElementById("meter-indicator");

    // Check if no sound / invalid pitch is detected
    if (!noteName || frequency === -1 || frequency === null || cents === null) {
        if (noteEl) noteEl.innerText = noteName || "--";
        if (freqEl) freqEl.innerText = "-- Hz";
        if (centsEl) centsEl.innerText = "0¢";
        if (statusEl) {
            statusEl.innerText = "Listening...";
            statusEl.className = "status-display";
        }
        if (meter) meter.style.left = "50%";
        soundPlayed = false; // Reset sound flag when quiet
        return;
    }

    // Display active tuning measurements
    if (noteEl) noteEl.innerText = noteName;
    if (freqEl) freqEl.innerText = `${frequency.toFixed(1)} Hz`;
    if (centsEl) centsEl.innerText = `${cents > 0 ? "+" : ""}${cents}¢`;

    if (statusEl) {
        statusEl.className = "status-display";

        if (Math.abs(cents) <= 5) {
            statusEl.innerText = "✓ In Tune!";
            statusEl.classList.add("status-tuned");
            playInTuneSound(); // 🔔 Play chime when in tune!
        } else if (cents < 0) {
            statusEl.innerText = `Flat ${Math.abs(cents)}¢`;
            statusEl.classList.add("status-flat");
            soundPlayed = false; // Reset so sound plays again when tuned
        } else {
            statusEl.innerText = `Sharp ${cents}¢`;
            statusEl.classList.add("status-sharp");
            soundPlayed = false; // Reset so sound plays again when tuned
        }
    }

    // Move tuning meter (-50¢ -> 0%, 0¢ -> 50%, +50¢ -> 100%)
    if (meter) {
        const clamped = Math.max(-50, Math.min(50, cents));
        meter.style.left = `${50 + clamped}%`;
    }
}
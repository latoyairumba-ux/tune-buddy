// ui.js
import { getTuningMessage } from "./tuner.js";

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
        } else if (cents < 0) {
            statusEl.innerText = `Flat ${Math.abs(cents)}¢`;
            statusEl.classList.add("status-flat");
        } else {
            statusEl.innerText = `Sharp ${cents}¢`;
            statusEl.classList.add("status-sharp");
        }
    }

    // Move tuning meter (-50¢ -> 0%, 0¢ -> 50%, +50¢ -> 100%)
    if (meter) {
        const clamped = Math.max(-50, Math.min(50, cents));
        meter.style.left = `${50 + clamped}%`;
    }
}
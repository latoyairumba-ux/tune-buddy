// ui.js

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

        return;
    }

    noteEl.innerText = noteName;
    freqEl.innerText = `${frequency.toFixed(2)} Hz`;
    centsEl.innerText = `${cents > 0 ? "+" : ""}${cents}¢`;

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

    // Move tuning meter
    const clamped = Math.max(-50, Math.min(50, cents));

    // -50¢ -> 0%
    // 0¢   -> 50%
    // +50¢ -> 100%
    meter.style.left = `${50 + clamped}%`;

}
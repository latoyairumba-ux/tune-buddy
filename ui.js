// ui.js
export function updateDisplay(noteName, frequency, cents) {
    const noteEl = document.getElementById("note-display");
    const freqEl = document.getElementById("freq-display");
    const statusEl = document.getElementById("status-display");
    
    if (!noteName) {
        statusEl.innerText = "Listening...";
        noteEl.innerText = "--";
        freqEl.innerText = "0.0 Hz";
        return;
    }

    // Change visual text indicators depending on cents
    let status = "";
    if (cents > 4) {
        status = `Sharp by ${cents}¢`;
    } else if (cents < -4) {
        status = `Flat by ${Math.abs(cents)}¢`;
    } else {
        status = "• In Tune! •";
    }

    noteEl.innerText = noteName;
    freqEl.innerText = `${frequency} Hz`;
    statusEl.innerText = status;
}
// script.js

import {
    initMicrophone,
    getAudioBuffer,
    getSampleRate
} from "./microphone.js";

import {
    detectPitch
} from "./pitch.js";

import {
    getString
} from "./notes.js";

import {
    getTuningStatus
} from "./tuner.js";

import {
    updateDisplay
} from "./ui.js";

const startBtn = document.getElementById("start-btn");

let isRunning = false;
let selectedString = "E2"; // Default string selection

// Start microphone tuner
async function startTuner() {
    try {
        console.log("Starting microphone...");

        if (startBtn) {
            startBtn.innerText = "Listening...";
            startBtn.disabled = true;
        }

        await initMicrophone();
        isRunning = true;

        console.log("Tuner running");
        tunerLoop();

    } catch (error) {
        console.error("Could not start tuner:", error);

        if (startBtn) {
            startBtn.innerText = "🎤 Start Tuner";
            startBtn.disabled = false;
        }
    }
}

// Main tuner loop
function tunerLoop() {
    if (!isRunning) {
        return;
    }

    const buffer = getAudioBuffer();
    const sampleRate = getSampleRate();

    // Wait until microphone buffer data exists
    if (!buffer) {
        requestAnimationFrame(tunerLoop);
        return;
    }

    const frequency = detectPitch(buffer, sampleRate);

    if (frequency !== -1 && frequency > 0) {
        const targetString = getString(selectedString);

        if (targetString) {
            const cents = getTuningStatus(
                frequency,
                targetString.frequency
            );

            // Log frequency so you can verify live audio detection in F12 console
            console.log(`Detected: ${frequency.toFixed(2)} Hz | Target: ${targetString.frequency} Hz | Cents: ${cents}`);

            updateDisplay(
                selectedString,
                frequency,
                cents
            );
        }
    } else {
        // ✅ Fixed: Keep selectedString active when mic detects silence
        updateDisplay(
            selectedString,
            -1,
            null
        );
    }

    requestAnimationFrame(tunerLoop);
}

// Start button listener
if (startBtn) {
    startBtn.addEventListener("click", () => {
        if (!isRunning) {
            startTuner();
        }
    });
}

// String selection button listeners
document
    .querySelectorAll(".string-btn")
    .forEach(button => {
        button.addEventListener("click", () => {
            // Fallback to button text if dataset.note isn't specified in HTML
            selectedString = button.dataset.note || button.innerText.trim();

            document
                .querySelectorAll(".string-btn")
                .forEach(btn => {
                    btn.classList.remove("selected");
                    btn.classList.remove("active");
                });

            button.classList.add("selected");
            button.classList.add("active");

            console.log("Selected Note:", selectedString);
        });
    });
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

let isRunning = false;

// Default guitar string
let selectedString = "E2";

// Start microphone tuner
async function startTuner() {
    try {
        console.log("Starting microphone...");
        await initMicrophone();
        isRunning = true;
        console.log("Tuner running");
        tunerLoop();
    } catch(error) {
        console.error("Could not start tuner:", error);
    }
}

// Main tuner loop
function tunerLoop() {
    if (!isRunning) {
        return;
    }

    const buffer = getAudioBuffer();
    const sampleRate = getSampleRate();

    const frequency = detectPitch(
        buffer,
        sampleRate
    );

    if (frequency !== -1) {
        const targetString = getString(selectedString);

        if (targetString) {
            const cents = getTuningStatus(
                frequency,
                targetString.frequency
            );

            updateDisplay(
                selectedString,
                frequency,
                cents
            );
        }
    } else {
        updateDisplay(
            null,
            null,
            0
        );
    }

    requestAnimationFrame(tunerLoop);
}

// Start button
const startBtn = document.getElementById("start-btn");
if (startBtn) {
    startBtn.addEventListener("click", () => {
        if (!isRunning) {
            startTuner();
        }
    });
}

// String selection buttons
document
    .querySelectorAll(".string-btn")
    .forEach(button => {
        button.addEventListener("click", () => {
            selectedString = button.dataset.note;

            document
                .querySelectorAll(".string-btn")
                .forEach(btn => {
                    btn.classList.remove("selected");
                });

            button.classList.add("selected");

            console.log("Selected:", selectedString);
        });
    });
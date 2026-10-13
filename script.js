// =========================
// Imports
// =========================

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


// =========================
// Tuner variables
// =========================

const startBtn =
    document.getElementById("start-btn");

let isRunning = false;

let selectedString = "E2";


// =========================
// Dark mode
// =========================

const darkModeCheckbox =
    document.getElementById("dark-mode");


function applyTheme() {

    const darkMode =
        localStorage.getItem("darkMode");


    if (darkMode === "false") {

        document.body.classList.add(
            "light-mode"
        );

    } else {

        document.body.classList.remove(
            "light-mode"
        );

    }


    if (darkModeCheckbox) {

        darkModeCheckbox.checked =
            darkMode !== "false";

    }

}


applyTheme();


if (darkModeCheckbox) {

    darkModeCheckbox.addEventListener(
        "change",
        () => {

            if (darkModeCheckbox.checked) {

                localStorage.setItem(
                    "darkMode",
                    "true"
                );

            } else {

                localStorage.setItem(
                    "darkMode",
                    "false"
                );

            }

            applyTheme();

        }
    );

}


// =========================
// Font size
// =========================

const increaseFontButton =
    document.getElementById(
        "increase-font"
    );

const decreaseFontButton =
    document.getElementById(
        "decrease-font"
    );

const fontSizeValue =
    document.getElementById(
        "font-size-value"
    );


// Default font size

const defaultFontSize = 100;


// Minimum font size

const minimumFontSize = 80;


// Maximum font size

const maximumFontSize = 160;


// Amount changed per click

const fontSizeStep = 10;


// =========================
// Apply font size
// =========================

function applyFontSize() {

    let savedFontSize =
        localStorage.getItem(
            "fontSize"
        );


    let fontSize =
        savedFontSize
            ? Number(savedFontSize)
            : defaultFontSize;


    // Check that the value is valid

    if (
        fontSize < minimumFontSize ||
        fontSize > maximumFontSize ||
        Number.isNaN(fontSize)
    ) {

        fontSize = defaultFontSize;

    }


    // Change the font size

    document.documentElement.style.fontSize =
        fontSize + "%";


    // Show current font size

    if (fontSizeValue) {

        fontSizeValue.innerText =
            "Font size: " + fontSize + "%";

    }


    // Disable increase button
    // at maximum size

    if (increaseFontButton) {

        increaseFontButton.disabled =
            fontSize >= maximumFontSize;

    }


    // Disable decrease button
    // at minimum size

    if (decreaseFontButton) {

        decreaseFontButton.disabled =
            fontSize <= minimumFontSize;

    }

}


// =========================
// Increase font size
// =========================

if (increaseFontButton) {

    increaseFontButton.addEventListener(
        "click",
        () => {

            let fontSize =
                Number(
                    localStorage.getItem(
                        "fontSize"
                    )
                ) || defaultFontSize;


            if (
                fontSize <
                maximumFontSize
            ) {

                fontSize += fontSizeStep;

            }


            localStorage.setItem(
                "fontSize",
                fontSize
            );


            applyFontSize();

        }
    );

}


// =========================
// Decrease font size
// =========================

if (decreaseFontButton) {

    decreaseFontButton.addEventListener(
        "click",
        () => {

            let fontSize =
                Number(
                    localStorage.getItem(
                        "fontSize"
                    )
                ) || defaultFontSize;


            if (
                fontSize >
                minimumFontSize
            ) {

                fontSize -= fontSizeStep;

            }


            localStorage.setItem(
                "fontSize",
                fontSize
            );


            applyFontSize();

        }
    );

}


// Apply saved font size

applyFontSize();


// =========================
// Start microphone tuner
// =========================

async function startTuner() {

    try {

        console.log(
            "Starting microphone..."
        );


        if (startBtn) {

            startBtn.innerText =
                "Listening...";

            startBtn.disabled = true;

        }


        await initMicrophone();


        isRunning = true;


        console.log(
            "Tuner running"
        );


        tunerLoop();


    } catch (error) {

        console.error(
            "Could not start tuner:",
            error
        );


        if (startBtn) {

            startBtn.innerText =
                "Start Tuner";

            startBtn.disabled = false;

        }

    }

}


// =========================
// Main tuner loop
// =========================

function tunerLoop() {

    if (!isRunning) {

        return;

    }


    const buffer =
        getAudioBuffer();

    const sampleRate =
        getSampleRate();


    // Wait for microphone data

    if (!buffer) {

        requestAnimationFrame(
            tunerLoop
        );

        return;

    }


    // Detect pitch

    const frequency =
        detectPitch(
            buffer,
            sampleRate
        );


    if (frequency !== -1) {

        const targetString =
            getString(
                selectedString
            );


        if (targetString) {

            const cents =
                getTuningStatus(
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


    // Continue tuner loop

    requestAnimationFrame(
        tunerLoop
    );

}


// =========================
// Start button
// =========================

if (startBtn) {

    startBtn.addEventListener(
        "click",
        () => {

            if (!isRunning) {

                startTuner();

            }

        }
    );

}


// =========================
// String selection
// =========================

const stringButtons =
    document.querySelectorAll(
        ".string-btn"
    );


stringButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                selectedString =
                    button.dataset.note;


                // Remove selected
                // from all buttons

                stringButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    }
                );


                // Select current button

                button.classList.add(
                    "selected"
                );


                console.log(
                    "Selected:",
                    selectedString
                );

            }
        );

    }
);


// import { initMicrophone, getAudioBuffer, sampleRate } from './microphone.js';
// import { detectPitch } from './pitch.js';
// import { frequencyToNote } from './notes.js';
// import { getTuningStatus } from './tuner.js';
// import { updateDisplay } from './ui.js';

// let isRunning = false;

// async function startTuner() {
//     try {
//         await initMicrophone();
//         isRunning = true;
//         tunerLoop();
//     } catch (err) {
//         console.error("Could not activate tuner:", err);
//     }
// }

// function tunerLoop() {
//     if (!isRunning) return;

//     const buffer = getAudioBuffer();
//     const frequency = detectPitch(buffer, sampleRate);
    
//     if (frequency && frequency !== -1) {
//         const note = frequencyToNote(frequency);
//         const tuningCents = getTuningStatus(frequency, note.frequency);
        
//         updateDisplay(note.name, frequency.toFixed(1), tuningCents);
//     } else {
//         updateDisplay(null, null, 0);
//     }

//     // Runs safely next frame without freezing the app window
//     requestAnimationFrame(tunerLoop);
// }

// // // Fire off setup when the user hits the E button
// // document.getElementById("E2").addEventListener("click", () => {
// //     if (!isRunning) {
// //         startTuner();
// //     }
// // });

// // At the bottom of script.js
// document.getElementById("E2").addEventListener("click", () => {
//     console.log("Button was physically clicked!"); // <-- Add this line
//     if (!isRunning) {
//         startTuner();
//     }
// });

// // Temporary Debug script.js
// let audioContext = null;

// async function testMic() {
//     console.log("Attempting to access microphone...");
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         console.log("Success! Microphone stream captured:", stream);
//         alert("It works! Microphone permission granted.");
//     } catch (err) {
//         console.error("Microphone error details:", err);
//         alert("Error accessing microphone: " + err.message);
//     }
// }

// document.getElementById("E2").addEventListener("click", () => {
//     testMic();
// });

// script.js
import { initMicrophone, getAudioBuffer, sampleRate } from './microphone.js';
import { detectPitch } from './pitch.js';
import { frequencyToNote } from './notes.js';
import { getTuningStatus } from './tuner.js';
import { updateDisplay } from './ui.js';

let isRunning = false;

async function startTuner() {
    try {
        console.log("Initializing microphone hardware...");
        await initMicrophone();
        isRunning = true;
        console.log("Tuner loop started!");
        tunerLoop();
    } catch (err) {
        console.error("Could not activate tuner:", err);
    }
}

function tunerLoop() {
    if (!isRunning) return;

    const buffer = getAudioBuffer();
    const frequency = detectPitch(buffer, sampleRate);
    
    // Check if a valid frequency was returned
    if (frequency && frequency !== -1) {
        const noteData = frequencyToNote(frequency);
        
        if (noteData) {
            // Use noteData.name (or noteData.note depending on your notes.js keys)
            const noteName = noteData.name || noteData.note; 
            const tuningCents = getTuningStatus(frequency, noteData.frequency);
            
            updateDisplay(noteName, frequency.toFixed(1), tuningCents);
        }
    } else {
        // No sound detected or audio is silent
        updateDisplay(null, null, 0);
    }

    // Requests the next animation frame safely without freezing the browser UI
    requestAnimationFrame(tunerLoop);
}

// Single active event listener for your HTML button
document.getElementById("E2").addEventListener("click", () => {
    console.log("Button 'E2' was physically clicked!");
    if (!isRunning) {
        startTuner();
    } else {
        console.log("Tuner is already actively listening.");
    }
});
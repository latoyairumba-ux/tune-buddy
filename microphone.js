// microphone.js

let audioContext = null;
let analyser = null;
let dataArray = null;
let sampleRate = 44100;

export async function initMicrophone() {
    // Already running
    if (audioContext) {
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            },
            video: false
        });

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

        // Get real hardware sample rate
        sampleRate = audioContext.sampleRate;

        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();

        // Larger size helps detect low guitar strings
        analyser.fftSize = 4096;
        analyser.smoothingTimeConstant = 0.8;

        source.connect(analyser);

        dataArray = new Float32Array(analyser.fftSize);

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        console.log("Microphone ready. Sample rate:", sampleRate);

    } catch (error) {
        console.error("Microphone initialization failed:", error);
        throw error;
    }
}

export function getAudioBuffer() {
    if (!analyser || !dataArray) {
        return null;
    }

    analyser.getFloatTimeDomainData(dataArray);
    return dataArray;
}

export function getSampleRate() {
    return sampleRate;
}
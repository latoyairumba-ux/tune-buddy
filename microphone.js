// // microphone.js
// let audioContext = null;
// let analyser = null;
// let dataArray = null;

// export let sampleRate = 44100; // Default fallback, will update dynamically

// export async function initMicrophone() {
//     if (audioContext) return; // Already initialized

//     // Request browser microphone access
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    
//     audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     sampleRate = audioContext.sampleRate; // Get exact hardware sample rate

//     const source = audioContext.createMediaStreamSource(stream);
//     analyser = audioContext.createAnalyser();
    
//     // 2048 or 4096 is ideal for catching low guitar frequencies (like Low E)
//     analyser.fftSize = 2048; 
    
//     source.connect(analyser);
//     dataArray = new Float32Array(analyser.fftSize);
// }

// export function getAudioBuffer() {
//     if (!analyser || !dataArray) return null;
    
//     // Pulls the latest raw time-domain audio data into our array
//     analyser.getFloatTimeDomainData(dataArray);
//     return dataArray;
// }

// microphone.js
let audioContext = null;
let analyser = null;
let dataArray = null;

export let sampleRate = 44100; // Default fallback, dynamically updates on init

export async function initMicrophone() {
    if (audioContext) return; // Prevent multiple initializations

    // Request browser mic access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    sampleRate = audioContext.sampleRate; // Read exact hardware sample rate

    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    
    // 2048 is required to give the pitch detector enough data samples for low frequencies
    analyser.fftSize = 2048; 
    
    source.connect(analyser);
    dataArray = new Float32Array(analyser.fftSize);
}

export function getAudioBuffer() {
    if (!analyser || !dataArray) return null;
    
    // Capture the current raw time-domain snapshot
    analyser.getFloatTimeDomainData(dataArray);
    return dataArray;
}
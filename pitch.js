// pitch.js
export function detectPitch(buffer, sampleRate) {
    if (!buffer) return -1;

    let size = buffer.length;
    let rms = 0;

    // 1. Calculate Root Mean Square (Volume) to ignore background silence
    for (let i = 0; i < size; i++) {
        rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.015) return -1; // Too quiet

    // 2. Autocorrelation
    const r1 = 0;
    const r2 = size;
    const len = r2 - r1;
    const c = new Float32Array(len);

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i; j++) {
            c[i] = c[i] + buffer[r1 + j] * buffer[r1 + j + i];
        }
    }

    // 3. Find the peak after the initial zero-lag drop-off
    let d = 0;
    while (d < len - 1 && c[d] > c[d + 1]) {
        d++;
    }

    // If we ran out of buffer space, exit
    if (d >= len - 1) return -1;

    let maxval = -1;
    let maxpos = -1;

    // Look for the absolute strongest periodic peak
    for (let i = d; i < len; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }

    let T0 = maxpos;

    // 4. Convert period distance directly to Hz
    if (T0 !== -1 && T0 !== 0) {
        const freq = sampleRate / T0;
        // Restrict to standard guitar ranges (approx 50Hz to 500Hz) to filter out harmonics
        if (freq > 50 && freq < 500) {
            return freq;
        }
    }
    return -1;
}
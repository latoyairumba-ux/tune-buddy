// pitch.js

export function detectPitch(buffer, sampleRate) {
    if (!buffer || !sampleRate) {
        return -1;
    }

    const size = buffer.length;

    // 1. Volume Check (RMS)
    let rms = 0;
    for (let i = 0; i < size; i++) {
        rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / size);

    if (rms < 0.01) {
        return -1;
    }

    // 2. Frequency Range Limits for Guitars
    const MIN_FREQ = 50;  
    const MAX_FREQ = 500; 

    const minOffset = Math.floor(sampleRate / MAX_FREQ);
    const maxOffset = Math.floor(sampleRate / MIN_FREQ);

    // 3. Fast Autocorrelation
    let bestOffset = -1;
    let highestCorrelation = 0;

    for (let offset = minOffset; offset <= maxOffset && offset < size; offset++) {
        let sum = 0;
        for (let i = 0; i < size - offset; i++) {
            sum += buffer[i] * buffer[i + offset];
        }

        if (sum > highestCorrelation) {
            highestCorrelation = sum;
            bestOffset = offset;
        }
    }

    if (bestOffset === -1) {
        return -1;
    }

    // 4. Parabolic Interpolation
    let refinedOffset = bestOffset;
    if (bestOffset > minOffset && bestOffset < maxOffset) {
        let prevSum = 0;
        let nextSum = 0;

        for (let i = 0; i < size - (bestOffset - 1); i++) {
            prevSum += buffer[i] * buffer[i + (bestOffset - 1)];
        }
        for (let i = 0; i < size - (bestOffset + 1); i++) {
            nextSum += buffer[i] * buffer[i + (bestOffset + 1)];
        }

        const a = (prevSum + nextSum - 2 * highestCorrelation) / 2;
        const b = (nextSum - prevSum) / 2;

        if (a !== 0) {
            refinedOffset = bestOffset - b / (2 * a);
        }
    }

    // 5. Convert to Frequency
    const frequency = sampleRate / refinedOffset;

    if (frequency < MIN_FREQ || frequency > MAX_FREQ) {
        return -1;
    }

    return frequency;
}
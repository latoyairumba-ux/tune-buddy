// pitch.js

export function detectPitch(buffer, sampleRate) {
    if (!buffer || !sampleRate) {
        return -1;
    }

    const size = buffer.length;

    // 1. Volume check (RMS)
    let rms = 0;
    for (let i = 0; i < size; i++) {
        rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / size);

    // Ignore silence
    if (rms < 0.003) {
        return -1;
    }

    // 2. Guitar frequency range (Standard tuning: E2 = 82Hz up to E4 = 330Hz)
    const MIN_FREQ = 65;
    const MAX_FREQ = 400;

    const minOffset = Math.floor(sampleRate / MAX_FREQ);
    const maxOffset = Math.floor(sampleRate / MIN_FREQ);

    // 3. Normalized autocorrelation
    let bestOffset = -1;
    let maxCorrelation = 0;

    for (let offset = minOffset; offset <= maxOffset; offset++) {
        let sum = 0;
        let count = size - offset; // Fixed: subtracted offset from size

        for (let i = 0; i < count; i++) {
            sum += buffer[i] * buffer[i + offset];
        }

        // Normalize sum by sample count
        const normalizedCorrelation = sum / count;

        if (normalizedCorrelation > maxCorrelation) {
            maxCorrelation = normalizedCorrelation;
            bestOffset = offset;
        }
    }

    if (bestOffset === -1 || maxCorrelation < 0.001) {
        return -1;
    }

    // 4. Parabolic interpolation to refine peak accuracy
    let refinedOffset = bestOffset;

    if (bestOffset > minOffset && bestOffset < maxOffset) {
        const getCorrelationAt = (off) => {
            let s = 0;
            let c = size - off;
            for (let i = 0; i < c; i++) {
                s += buffer[i] * buffer[i + off]; // Fixed: added [i + off]
            }
            return s / c;
        };

        const prev = getCorrelationAt(bestOffset - 1);
        const curr = maxCorrelation;
        const next = getCorrelationAt(bestOffset + 1);

        const a = (prev + next - 2 * curr) / 2;
        const b = (next - prev) / 2;

        if (a !== 0) {
            refinedOffset = bestOffset - b / (2 * a);
        }
    }

    // 5. Convert offset to frequency
    const frequency = sampleRate / refinedOffset;

    if (frequency < MIN_FREQ || frequency > MAX_FREQ) {
        return -1;
    }

    return frequency;
}
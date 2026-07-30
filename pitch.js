// pitch.js

export function detectPitch(buffer, sampleRate) {
    if (!buffer || !sampleRate) {
        return -1;
    }

    const size = buffer.length;

    // 1. RMS Volume check (Forgiving threshold for acoustic instrument capture)
    let rms = 0;
    for (let i = 0; i < size; i++) {
        rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / size);

    if (rms < 0.001) {
        return -1; // Ignore true silence
    }

    // 2. Guitar frequency range (E2 = 82Hz up to E4 = 330Hz)
    const MIN_FREQ = 65;
    const MAX_FREQ = 400;

    const minOffset = Math.floor(sampleRate / MAX_FREQ);
    const maxOffset = Math.floor(sampleRate / MIN_FREQ);

    // 3. Compute total signal energy R(0) to normalize regardless of volume
    let energy = 0;
    for (let i = 0; i < size; i++) {
        energy += buffer[i] * buffer[i];
    }

    if (energy === 0) return -1;

    // 4. Normalized autocorrelation
    let bestOffset = -1;
    let maxCorrelation = 0;

    for (let offset = minOffset; offset <= maxOffset; offset++) {
        let sum = 0;
        let count = size - offset;

        for (let i = 0; i < count; i++) {
            sum += buffer[i] * buffer[i + offset];
        }

        // True normalized correlation (scale 0.0 to 1.0)
        const normalizedCorrelation = sum / energy;

        if (normalizedCorrelation > maxCorrelation) {
            maxCorrelation = normalizedCorrelation;
            bestOffset = offset;
        }
    }

    // Pitch detection rejection threshold (20% waveform match)
    if (bestOffset === -1 || maxCorrelation < 0.2) {
        return -1;
    }

    // 5. Parabolic interpolation to refine peak frequency accuracy
    let refinedOffset = bestOffset;

    if (bestOffset > minOffset && bestOffset < maxOffset) {
        const getCorrelationAt = (off) => {
            let s = 0;
            let c = size - off;
            for (let i = 0; i < c; i++) {
                s += buffer[i] * buffer[i + off];
            }
            return s / energy;
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

    // 6. Convert refined sample offset to frequency (Hz)
    const frequency = sampleRate / refinedOffset;

    if (frequency < MIN_FREQ || frequency > MAX_FREQ) {
        return -1;
    }

    return frequency;
}
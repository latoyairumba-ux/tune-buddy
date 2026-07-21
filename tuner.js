// tuner.js

// Calculate pitch difference in cents
export function getTuningStatus(frequency, targetFrequency) {
    // Ensure both frequencies exist, are valid numbers, and are greater than 0
    if (
        typeof frequency !== "number" ||
        typeof targetFrequency !== "number" ||
        frequency <= 0 ||
        targetFrequency <= 0 ||
        frequency === -1
    ) {
        return null;
    }

    // Formula: 1200 * log2(f / f_target)
    const cents = Math.round(
        1200 * Math.log2(frequency / targetFrequency)
    );

    return cents;
}

// Convert cents into a readable tuning state
export function getTuningMessage(cents) {
    if (cents === null || cents === undefined || Number.isNaN(cents)) {
        return {
            text: "Listening...",
            state: "neutral"
        };
    }

    // Within 5 cents is considered tuned
    if (Math.abs(cents) <= 5) {
        return {
            text: "✓ In Tune!",
            state: "tuned"
        };
    }

    // Slightly flat
    if (cents < 0) {
        return {
            text: `Flat ${Math.abs(cents)}¢`,
            state: "flat"
        };
    }

    // Danger zone: too sharp (prevents string snapping)
    if (cents > 40) {
        return {
            text: `⚠ Very Sharp ${cents}¢ - Loosen String`,
            state: "danger"
        };
    }

    // Slightly sharp
    return {
        text: `Sharp ${cents}¢`,
        state: "sharp"
    };
}
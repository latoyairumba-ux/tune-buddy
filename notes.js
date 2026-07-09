    // notes.js
const GUITAR_STRINGS = [
    { name: 'E2', frequency: 82.41 },
    { name: 'A2', frequency: 110.00 },
    { name: 'D3', frequency: 146.83 },
    { name: 'G3', frequency: 196.00 },
    { name: 'B3', frequency: 246.94 },
    { name: 'E4', frequency: 329.63 }
];

export function frequencyToNote(frequency) {
    if (!frequency || frequency === -1) return null;

    let closest = GUITAR_STRINGS[0];
    let minDiff = Math.abs(frequency - closest.frequency);

    for (let i = 1; i < GUITAR_STRINGS.length; i++) {
        let diff = Math.abs(frequency - GUITAR_STRINGS[i].frequency);
        if (diff < minDiff) {
            minDiff = diff;
            closest = GUITAR_STRINGS[i];
        }
    }
    return closest; 
}
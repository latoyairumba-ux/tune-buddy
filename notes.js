// notes.js

export const GUITAR_STRINGS = {
    E2: { name: "E2", frequency: 82.41 },
    A2: { name: "A2", frequency: 110.00 },
    D3: { name: "D3", frequency: 146.83 },
    G3: { name: "G3", frequency: 196.00 },
    B3: { name: "B3", frequency: 246.94 },
    E4: { name: "E4", frequency: 329.63 }
};

export function getString(noteName) {
    return GUITAR_STRINGS[noteName] || null;
}
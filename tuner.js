// tuner.js
export function getTuningStatus(frequency, targetFrequency) {
    if (!frequency || frequency === -1 || !targetFrequency) return 0;
    
    // Formula to calculate absolute pitch deviation in cents
    return Math.floor(1200 * Math.log2(frequency / targetFrequency));
}
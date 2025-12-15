/**
 * Timer Store Configuration and Utilities
 * Provides mode configuration and helper functions for the Pomodoro timer
 */

// Timer mode configurations with durations in seconds
export const MODES = {
  focus: {
    id: 'focus',
    label: 'Focus',
    duration: 25 * 60, // 25 minutes
    color: '#ef4444',
    colorRgb: '239, 68, 68',
    bgClass: 'bg-gradient-focus',
    nextMode: 'shortBreak',
    nextLabel: 'Take a Short Break',
    textVar: '--focus-text-color'
  },
  shortBreak: {
    id: 'shortBreak',
    label: 'Short Break',
    duration: 5 * 60, // 5 minutes
    color: '#10b981',
    colorRgb: '16, 185, 129',
    bgClass: 'bg-gradient-short-break',
    nextMode: 'focus',
    nextLabel: 'Start Focus Session',
    textVar: '--short-break-text-color'
  },
  longBreak: {
    id: 'longBreak',
    label: 'Long Break',
    duration: 15 * 60, // 15 minutes
    color: '#3b82f6',
    colorRgb: '59, 130, 246',
    bgClass: 'bg-gradient-long-break',
    nextMode: 'focus',
    nextLabel: 'Start Focus Session',
    textVar: '--long-break-text-color'
  }
};

/**
 * Format seconds into MM:SS string
 * @param {number} totalSeconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate progress as a decimal (1 = full, 0 = empty)
 * @param {number} remaining - Remaining time in seconds
 * @param {number} total - Total duration in seconds
 * @returns {number} Progress value between 0 and 1
 */
export function calculateProgress(remaining, total) {
  if (total === 0) return 1;
  return remaining / total;
}

/**
 * Get the mode label for display
 * @param {string} modeId - Mode identifier
 * @returns {string} Human-readable mode label
 */
export function getModeLabel(modeId) {
  return MODES[modeId]?.label || 'Focus';
}

/**
 * Play completion notification sound using Web Audio API
 * Creates a pleasant, non-jarring tone sequence
 */
export function playCompletionSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play a sequence of three pleasant beeps
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
    const beepDuration = 0.15;
    const gap = 0.1;
    
    frequencies.forEach((freq, index) => {
      const startTime = audioContext.currentTime + (index * (beepDuration + gap));
      
      // Create oscillator for tone
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime);
      
      // Create gain node for envelope (attack/decay)
      const gainNode = audioContext.createGain();
      
      // Envelope: quick attack, sustain, gentle decay
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01); // Attack
      gainNode.gain.setValueAtTime(0.3, startTime + beepDuration - 0.05); // Sustain
      gainNode.gain.linearRampToValueAtTime(0, startTime + beepDuration); // Decay
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Schedule playback
      oscillator.start(startTime);
      oscillator.stop(startTime + beepDuration);
    });
    
    // Clean up audio context after sounds complete
    setTimeout(() => {
      audioContext.close();
    }, 1000);
    
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

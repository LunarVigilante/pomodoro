<script>
  import { Play, Pause, RotateCcw } from 'lucide-svelte';
  
  /**
   * TimerControls Component
   * Provides play/pause and reset buttons for timer control
   * Props:
   * - isRunning: Whether timer is currently running
   * - isComplete: Whether timer has completed (shows different state)
   * - color: Theme color for buttons
   * - onStart: Callback when start/resume is clicked
   * - onPause: Callback when pause is clicked
   * - onReset: Callback when reset is clicked
   */
  
  let { 
    isRunning = false, 
    isComplete = false,
    color = '#ef4444',
    onStart = () => {},
    onPause = () => {},
    onReset = () => {}
  } = $props();
  
  function handlePlayPause() {
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  }
</script>

<div class="flex items-center justify-center gap-4">
  <!-- Reset Button -->
  <button
    type="button"
    class="control-btn bg-white/50 hover:bg-white/70 shadow-md"
    style="--ring-color: {color}"
    onclick={onReset}
    aria-label="Reset timer"
    title="Reset timer (R)"
  >
    <RotateCcw 
      size={24} 
      strokeWidth={2.5}
      style="color: {color}"
    />
  </button>
  
  <!-- Play/Pause Button (Primary) -->
  <button
    type="button"
    class="control-btn control-btn-primary"
    style="background-color: {color}; --ring-color: {color}"
    onclick={handlePlayPause}
    aria-label={isRunning ? 'Pause timer' : (isComplete ? 'Restart timer' : 'Start timer')}
    title={isRunning ? 'Pause (Space)' : 'Start (Space)'}
  >
    {#if isRunning}
      <Pause 
        size={28} 
        strokeWidth={2.5}
        class="text-white"
      />
    {:else}
      <Play 
        size={28} 
        strokeWidth={2.5}
        class="text-white ml-1"
      />
    {/if}
  </button>
  
  <!-- Spacer to balance layout -->
  <div class="w-14 h-14"></div>
</div>

<style>
  .control-btn {
    /* Focus ring using custom property */
    --tw-ring-color: var(--ring-color, #ef4444);
  }
  
  .control-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5), 0 0 0 5px var(--ring-color);
  }
  
  .control-btn-primary {
    /* Subtle shadow with theme color */
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  }
  
  .control-btn-primary:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
</style>

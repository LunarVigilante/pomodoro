<script>
  import { fly, fade } from 'svelte/transition';
  import { Brain, Coffee, Moon } from 'lucide-svelte';
  
  /**
   * TimerDisplay Component
   * Shows the countdown time in MM:SS format with mode label
   * Props:
   * - minutes: Number of minutes remaining
   * - seconds: Number of seconds remaining
   * - mode: Current mode object with id and label
   * - isRunning: Whether timer is currently running
   * - isComplete: Whether timer has completed
   */
  
  let { minutes = 25, seconds = 0, mode, isRunning = false, isComplete = false } = $props();
  
  // Get the appropriate icon component based on mode
  const modeIcons = {
    focus: Brain,
    shortBreak: Coffee,
    longBreak: Moon
  };
  
  let IconComponent = $derived(modeIcons[mode?.id] || Brain);
  // Derive mode-specific text color class for light and dark modes
  // Dark mode uses text-red-400 for all modes for consistent visibility
  let modeTextClass = $derived(
    mode?.id === 'shortBreak'
      ? 'text-emerald-600 dark:text-red-400'
      : mode?.id === 'longBreak'
        ? 'text-blue-600 dark:text-red-400'
        : 'text-red-600 dark:text-red-400'
  );
  
  // Determine if we should show the pulse animation (paused but not reset/complete)
  let shouldPulse = $derived(!isRunning && !isComplete && (minutes > 0 || seconds > 0) && 
    (minutes !== Math.floor(mode?.duration / 60) || seconds !== mode?.duration % 60));
</script>

<div 
  class="flex flex-col items-center justify-center select-none-force"
  in:fly={{ y: 20, duration: 300, delay: 100 }}
>
  <!-- Time Display -->
  <div
    class={`timer-font text-5xl sm:text-6xl font-semibold tracking-tight ${modeTextClass}`}
    class:animate-pulse-paused={shouldPulse}
    aria-live="polite"
    aria-atomic="true"
  >
    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
  </div>
  
  <!-- Mode Label -->
  {#key mode?.id}
    <div
      class={`flex items-center gap-2 mt-2 text-base sm:text-lg font-medium opacity-80 ${modeTextClass}`}
      in:fade={{ duration: 200 }}
    >
      <svelte:component this={IconComponent} size={18} strokeWidth={2.5} />
      <span>{mode?.label || 'Focus'}</span>
    </div>
  {/key}
</div>

<style>
  /* Ensure tabular figures for consistent number width */
  .timer-font {
    font-variant-numeric: tabular-nums;
  }
</style>

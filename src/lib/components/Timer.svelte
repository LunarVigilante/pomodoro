<script>
  import { fly, fade } from 'svelte/transition';
  import { Play } from 'lucide-svelte';
  import CircularProgress from './CircularProgress.svelte';
  import TimerDisplay from './TimerDisplay.svelte';
  import TimerControls from './TimerControls.svelte';
  import ModeSelector from './ModeSelector.svelte';
  import { MODES, formatTime, calculateProgress, playCompletionSound } from '../stores/timer.js';
  
  /**
   * Timer Component (Orchestrator)
   * Main container that manages all timer state and logic
   * Exposes currentMode for parent component to adjust background
   */
  
  // Expose current mode to parent for background color sync
  let { onModeChange = () => {} } = $props();
  
  // ============================================
  // STATE MANAGEMENT (Svelte 5 Runes)
  // ============================================
  
  // Current timer mode
  let currentModeId = $state('focus');
  
  // Time remaining in seconds
  let timeRemaining = $state(MODES.focus.duration);
  
  // Timer running state
  let isRunning = $state(false);
  
  // Timer completion state
  let isComplete = $state(false);
  
  // Target end time for accurate timing (handles tab inactivity)
  let targetEndTime = $state(null);
  
  // Interval ID for cleanup
  let intervalId = $state(null);
  
  // Celebration animation trigger
  let showCelebration = $state(false);
  
  // ============================================
  // DERIVED VALUES
  // ============================================
  
  // Current mode configuration object
  let currentMode = $derived(MODES[currentModeId]);
  
  // Total duration for current mode
  let totalDuration = $derived(currentMode.duration);
  
  // Progress as decimal (1 = full, 0 = empty)
  let progress = $derived(calculateProgress(timeRemaining, totalDuration));

  // Formatted time string (MM:SS)
  let formattedTime = $derived(formatTime(timeRemaining));

  // Minutes and seconds for display
  let minutes = $derived(Math.floor(timeRemaining / 60));
  let seconds = $derived(timeRemaining % 60);

  // Check if timer is at initial state (not started)
  let isAtInitial = $derived(timeRemaining === totalDuration && !isRunning);

  // Derive mode-specific text colors with matching dark-mode variants
  let modeTextClass = $derived(
    currentModeId === 'shortBreak'
      ? 'text-emerald-600 dark:text-emerald-300'
      : currentModeId === 'longBreak'
        ? 'text-blue-600 dark:text-blue-300'
        : 'text-red-600 dark:text-red-300'
  );
  
  // ============================================
  // EFFECTS
  // ============================================
  
  // Update document title
  $effect(() => {
    if (isRunning) {
      document.title = `${formattedTime} - ${currentMode.label}`;
    } else if (isComplete) {
      document.title = `Done! - ${currentMode.label}`;
    } else if (!isAtInitial) {
      document.title = `${formattedTime} - Paused`;
    } else {
      document.title = 'Pomodoro Timer';
    }
    
    // Cleanup: reset title when component unmounts
    return () => {
      document.title = 'Pomodoro Timer';
    };
  });
  
  // Notify parent of mode changes
  $effect(() => {
    onModeChange(currentModeId);
  });
  
  // Keyboard shortcuts
  $effect(() => {
    function handleKeydown(event) {
      // Ignore if user is typing in an input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (event.code === 'Space') {
        event.preventDefault();
        if (isComplete) {
          startNextSession();
        } else if (isRunning) {
          pause();
        } else {
          start();
        }
      } else if (event.code === 'KeyR') {
        event.preventDefault();
        reset();
      }
    }
    
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
  
  // ============================================
  // TIMER LOGIC
  // ============================================
  
  function start() {
    if (isComplete) {
      // If complete, reset first then start
      timeRemaining = totalDuration;
      isComplete = false;
    }
    
    isRunning = true;
    targetEndTime = Date.now() + (timeRemaining * 1000);
    
    // Use setInterval with Date.now() comparison for accuracy
    intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((targetEndTime - now) / 1000);
      
      if (remaining <= 0) {
        // Timer complete
        timeRemaining = 0;
        isRunning = false;
        isComplete = true;
        clearInterval(intervalId);
        intervalId = null;
        
        // Play completion sound
        playCompletionSound();
        
        // Trigger celebration animation
        showCelebration = true;
        setTimeout(() => {
          showCelebration = false;
        }, 600);
      } else {
        timeRemaining = remaining;
      }
    }, 100); // Check frequently for accuracy
  }
  
  function pause() {
    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    targetEndTime = null;
  }
  
  function reset() {
    pause();
    timeRemaining = totalDuration;
    isComplete = false;
  }
  
  function changeMode(newModeId) {
    if (newModeId === currentModeId) return;
    
    // Stop timer and reset to new mode
    pause();
    currentModeId = newModeId;
    timeRemaining = MODES[newModeId].duration;
    isComplete = false;
  }
  
  function startNextSession() {
    const nextModeId = currentMode.nextMode;
    currentModeId = nextModeId;
    timeRemaining = MODES[nextModeId].duration;
    isComplete = false;
    start();
  }
  
  // Cleanup on unmount
  $effect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });
</script>

<div 
  class="glass-container p-6 sm:p-8 md:p-10 w-full max-w-md mx-auto"
  class:animate-celebration={showCelebration}
>
  <!-- Mode Selector -->
  <div class="mb-6 sm:mb-8">
    <ModeSelector
      currentMode={currentModeId}
      disabled={isRunning}
      onModeChange={changeMode}
    />
  </div>
  
  <!-- Timer Ring & Display -->
  <div class="relative flex items-center justify-center mb-6 sm:mb-8">
    <!-- Progress Ring -->
    <CircularProgress 
      {progress}
      color={currentMode.color}
      size={280}
    />
    
    <!-- Timer Display (positioned over ring) -->
    <div class="absolute inset-0 flex items-center justify-center">
      <TimerDisplay 
        {minutes}
        {seconds}
        mode={currentMode}
        {isRunning}
        {isComplete}
      />
    </div>
  </div>
  
  <!-- Controls or Next Session Prompt -->
  {#if isComplete}
    <!-- Completion State: Show next session button -->
    <div
      class="flex flex-col items-center gap-4"
      in:fly={{ y: 20, duration: 300 }}
    >
      <p class={`text-lg font-medium opacity-80 ${modeTextClass}`}>
        Session complete!
      </p>
      
      <button
        type="button"
        class="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white transition-all duration-150 hover:scale-105 active:scale-95 shadow-lg"
        style="background-color: {MODES[currentMode.nextMode].color}"
        onclick={startNextSession}
      >
        <Play size={20} strokeWidth={2.5} />
        <span>{currentMode.nextLabel}</span>
      </button>
      
      <button
        type="button"
        class={`text-sm opacity-60 hover:opacity-100 transition-opacity ${modeTextClass}`}
        onclick={reset}
      >
        Reset instead
      </button>
    </div>
  {:else}
    <!-- Normal State: Show controls -->
    <TimerControls 
      {isRunning}
      {isComplete}
      color={currentMode.color}
      onStart={start}
      onPause={pause}
      onReset={reset}
    />
  {/if}
  
  <!-- Keyboard Hints -->
  <div 
    class={`mt-6 sm:mt-8 text-center text-xs opacity-60 ${modeTextClass}`}
  >
    <span class="hidden sm:inline">Press <kbd class="kbd-hint">Space</kbd> to {isRunning ? 'pause' : 'start'} · <kbd class="kbd-hint">R</kbd> to reset</span>
  </div>
</div>

<style>
  kbd {
    font-family: inherit;
    font-size: 0.75rem;
  }
  
  .kbd-hint {
    padding: 0.125rem 0.375rem;
    background: var(--kbd-bg);
    border-radius: 0.25rem;
  }
</style>

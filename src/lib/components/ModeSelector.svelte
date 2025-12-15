<script>
  import { Brain, Coffee, Moon } from 'lucide-svelte';
  import { MODES } from '../stores/timer.js';
  
  /**
   * ModeSelector Component
   * Allows switching between Focus, Short Break, and Long Break modes
   * Props:
   * - currentMode: Current mode ID string
   * - disabled: Whether mode switching is disabled (e.g., while timer running)
   * - onModeChange: Callback when mode is changed
   */
  
  let { 
    currentMode = 'focus',
    disabled = false,
    onModeChange = () => {}
  } = $props();
  
  // Mode button configurations
  const modeButtons = [
    { id: 'focus', label: 'Focus', icon: Brain, color: MODES.focus.color, textVar: MODES.focus.textVar },
    { id: 'shortBreak', label: 'Short Break', icon: Coffee, color: MODES.shortBreak.color, textVar: MODES.shortBreak.textVar },
    { id: 'longBreak', label: 'Long Break', icon: Moon, color: MODES.longBreak.color, textVar: MODES.longBreak.textVar }
  ];
  
  function handleModeClick(modeId) {
    if (!disabled && modeId !== currentMode) {
      onModeChange(modeId);
    }
  }
</script>

<div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
  {#each modeButtons as mode (mode.id)}
    {@const isActive = currentMode === mode.id}
    <button
      type="button"
      class="mode-btn min-w-[44px] min-h-[44px]"
      class:mode-focus={mode.id === 'focus'}
      class:mode-active={isActive}
      class:opacity-100={isActive}
      class:opacity-60={!isActive && !disabled}
      style="
        background-color: {isActive ? mode.color : 'rgba(255, 255, 255, 0.5)'};
        color: {isActive ? 'white' : `var(${mode.textVar ?? '--focus-text-color'})`};
        --ring-color: {mode.color};
      "
      disabled={disabled}
      onclick={() => handleModeClick(mode.id)}
      aria-label="{mode.label} mode"
      aria-pressed={isActive}
    >
      <svelte:component this={mode.icon} size={18} strokeWidth={2.5} />
      <span class="hidden sm:inline">{mode.label}</span>
    </button>
  {/each}
</div>

<style>
  .mode-btn {
    --tw-ring-color: var(--ring-color, #ef4444);
  }
  
  .mode-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5), 0 0 0 5px var(--ring-color);
  }
  
  .mode-btn:disabled {
    /* Reduce visual prominence when disabled */
    filter: grayscale(30%);
  }

  /* Focus mode specific styling */
  .mode-btn.mode-focus.mode-active {
    background-color: var(--focus-primary);
  }

  :global(.dark) .mode-btn.mode-focus.mode-active {
    background-color: #fb7185 !important; /* red-400 */
    color: white;
  }
</style>

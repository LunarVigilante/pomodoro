<script>
  import Timer from './lib/components/Timer.svelte';
  import { MODES } from './lib/stores/timer.js';
  import { Sun, Moon } from 'lucide-svelte';
  
  /**
   * App Component
   * Root component that provides the animated gradient background
   * and centers the Timer component
   */
  
  // Track current mode for background color
  let currentModeId = $state('focus');
  
  // Dark mode state
  let isDarkMode = $state(false);
  
  // Get the background class for current mode
  let bgClass = $derived(MODES[currentModeId]?.bgClass || 'bg-gradient-focus');
  
  function handleModeChange(newModeId) {
    currentModeId = newModeId;
  }
  
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    // Toggle dark class on html element for CSS variable switching
    document.documentElement.classList.toggle('dark', isDarkMode);
  }
  
  // Initialize dark mode based on system preference
  $effect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      isDarkMode = e.matches;
      document.documentElement.classList.toggle('dark', e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  });
</script>

<main 
  class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-transition {bgClass}"
>
  <!-- Dark Mode Toggle Button -->
  <button
    type="button"
    class="fixed top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full glass-container shadow-lg 
           transition-all duration-150 hover:scale-105 active:scale-95 z-50"
    onclick={toggleDarkMode}
    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    title={isDarkMode ? 'Switch to light mode (L)' : 'Switch to dark mode (D)'}
  >
    {#if isDarkMode}
      <Sun size={20} class="text-yellow-400" strokeWidth={2.5} />
    {:else}
      <Moon size={20} class="text-slate-600" strokeWidth={2.5} />
    {/if}
  </button>
  
  <Timer onModeChange={handleModeChange} />
</main>

<style>
  main {
    /* Smooth gradient background transitions */
    transition: background 500ms ease-in-out;
  }
  
  /* Gradient backgrounds defined with CSS variables for dark mode support */
  :global(.bg-gradient-focus) {
    background: linear-gradient(135deg, var(--focus-bg-from), var(--focus-bg-to));
  }
  
  :global(.bg-gradient-short-break) {
    background: linear-gradient(135deg, var(--short-break-bg-from), var(--short-break-bg-to));
  }
  
  :global(.bg-gradient-long-break) {
    background: linear-gradient(135deg, var(--long-break-bg-from), var(--long-break-bg-to));
  }
</style>

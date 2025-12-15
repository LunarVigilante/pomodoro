import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess()
  // Note: Runes mode is automatically enabled per-component when using $state, $derived, etc.
  // We don't set runes: true globally to maintain compatibility with lucide-svelte
};

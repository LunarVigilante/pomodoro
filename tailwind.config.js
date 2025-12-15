/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{svelte,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        // Focus Mode Colors (Red)
        focus: {
          primary: '#ef4444',
          'bg-from': '#fef2f2',
          'bg-to': '#fee2e2'
        },
        // Short Break Mode Colors (Emerald)
        'short-break': {
          primary: '#10b981',
          'bg-from': '#ecfdf5',
          'bg-to': '#d1fae5'
        },
        // Long Break Mode Colors (Blue)
        'long-break': {
          primary: '#3b82f6',
          'bg-from': '#eff6ff',
          'bg-to': '#dbeafe'
        }
      },
      animation: {
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'celebration': 'celebration 0.5s ease-out'
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'celebration': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.05)', filter: 'brightness(1.2)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' }
        }
      },
      backdropBlur: {
        '20': '20px'
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: []
};

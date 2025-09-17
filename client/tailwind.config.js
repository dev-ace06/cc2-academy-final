/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Clash of Clans inspired color palette
        coc: {
          gold: '#FFD700',
          'gold-dark': '#B8860B',
          blue: '#1E40AF',
          'blue-dark': '#1E3A8A',
          red: '#DC2626',
          'red-dark': '#B91C1C',
          green: '#059669',
          'green-dark': '#047857',
          purple: '#7C3AED',
          'purple-dark': '#6D28D9',
          orange: '#EA580C',
          'orange-dark': '#C2410C',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          }
        }
      },
      fontFamily: {
        'coc': ['Supercell-Magic', 'Arial', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'coc': '0 4px 14px 0 rgba(255, 215, 0, 0.2)',
        'coc-lg': '0 10px 25px 0 rgba(255, 215, 0, 0.3)',
      }
    },
  },
  plugins: [],
}









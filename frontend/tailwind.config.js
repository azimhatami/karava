/** @type {import('tailwindcss').Config} */

import { fontFamily } from "tailwindcss/defaultTheme";

function withOpacity(variableName) {
  return ({ opacityValue}) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  }
}


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[class=\'dark-mode\']'],
  theme: {
    extend: {
      colors: {
        // "مرکب / Ink" — home-page identity. Accents are an oklch harmonic
        // pair (same L & C, hue apart): mint = action, amber = escrow.
        ink: {
          DEFAULT: '#071411',
          raised: '#0D211B',
          paper: '#F7F5EF',
          card: '#FFFFFF',
          line: '#E4E1D6',
          hair: '#EEEBE3',
          well: '#F1EFE8',
          text: '#0E1F1A',
          body: '#3C4C46',
          muted: '#5C6E66',
          dim: '#8CA69B',
          mint: '#45E499',
          'mint-mid': '#1E7C50',
          'mint-deep': '#005D37',
          'mint-tint': '#D4F9E2',
          amber: '#FFAC28',
          'amber-deep': '#894D00',
          'amber-tint': '#FFEDD6',
        },
        karava: {
          'bg-subtle': '#F8F9FD',
          white: '#FFFFFF',
          'green-light': '#8EC3A9',
          green: '#007A55',
          'green-dark': '#0D4B39',
          'green-darker': '#00362E',
          gray: '#6E6E6E',
          'gray-blue': '#677487',
          'blue-light': '#4A9CFC',
          blue: '#155DFC',
          text: '#1D1B20',
          red: '#C9093D',
        },
        primary: {
          900: withOpacity("--color-primary-900"),
          800: withOpacity("--color-primary-800"),
          700: withOpacity("--color-primary-700"),
          600: withOpacity("--color-primary-600"),
          500: withOpacity("--color-primary-500"),
          400: withOpacity("--color-primary-400"),
          300: withOpacity("--color-primary-300"),
          200: withOpacity("--color-primary-200"),
          100: withOpacity("--color-primary-100"),
        },
        secondary: {
          900: withOpacity("--color-secondary-900"),
          800: withOpacity("--color-secondary-800"),
          700: withOpacity("--color-secondary-700"),
          600: withOpacity("--color-secondary-600"),
          500: withOpacity("--color-secondary-500"),
          400: withOpacity("--color-secondary-400"),
          300: withOpacity("--color-secondary-300"),
          200: withOpacity("--color-secondary-200"),
          100: withOpacity("--color-secondary-100"),
          50: withOpacity("--color-secondary-50"),
          0: withOpacity("--color-secondary-0"),
        },
        success: withOpacity("--color-success"),
        warning: withOpacity("--color-warning"),
        error: withOpacity("--color-error"),
      },
      container: {
        center: true,
        padding: '1rem',
      },
      fontFamily: {
        sans: ["Vazir", ...fontFamily.sans]
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
    strategy: 'class',
  }),
  ],
}


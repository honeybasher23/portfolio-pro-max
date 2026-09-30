/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#0B0F17',
        surface: '#111621',
        border: '#232D3F',
        textMain: '#E2E8F0',
        textMuted: '#64748B',
        action: '#2563EB',
        askGreen: '#10B981', 
        bidRed: '#F43F5E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      // Force sharp edges system-wide
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
      }
    },
  },
  plugins: [],
}
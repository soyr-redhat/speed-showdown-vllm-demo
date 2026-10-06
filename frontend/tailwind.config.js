/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rh': {
          bg: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          deep: 'var(--bg-deep)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-tertiary': 'var(--text-tertiary)',
          red: '#ee0000',
          'red-hover': '#a60000',
        },
        'gray': {
          30: '#c7c7c7',
          40: '#a3a3a3',
          50: '#707070',
          60: '#4d4d4d',
          70: '#353535',
          95: '#151515',
        },
        'purple': {
          10: '#ece6ff',
          30: '#b6a6e9',
          40: '#876fd4',
          50: '#5e40be',
          60: '#3d2785',
          70: '#21134d',
        },
      },
      fontFamily: {
        'display': ['"Red Hat Display"', 'sans-serif'],
        'text': ['"Red Hat Text"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}

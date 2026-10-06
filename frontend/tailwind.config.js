/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#151515',
        surface: '#1f1f1f',
        surface2: '#292929',
        line: '#3b3b3b',
        accent: '#ee0000',
        'accent-deep': '#a60000',
        proof: '#f4c145',
        warning: '#f5a623',
        danger: '#f0561d',
        text: '#ffffff',
        'text-2': '#c7c7c7',
        'text-3': '#a3a3a3',
        dim: '#707070',
      },
      fontFamily: {
        display: ['"Red Hat Display"', 'sans-serif'],
        text: ['"Red Hat Text"', 'system-ui, sans-serif'],
        mono: ['"Red Hat Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 20px 60px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
}

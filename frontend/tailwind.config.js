/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cc-blue':        '#0c5193',
        'cc-blue-medium': '#446dab',
        'cc-blue-light':  '#7c9abf',
        'cc-blue-navy':   '#193e6e',
        'cc-blue-dark':   '#182853',
        'cc-orange':      '#f58021',
        'cc-orange-light':'#faac76',
        'cc-orange-medium':'#f78d2a',
        'cc-orange-dark': '#e08027',
        'cc-orange-brown':'#bd6d2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

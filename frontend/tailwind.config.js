/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0E0F11',
          sidebar: '#16181C',
          card: '#1E2126',
          border: '#2E333B',
          text: '#E8EAED',
          muted: '#9AA0AC',
          subtext: '#5A6270',
          gold: '#D4A853',
          goldHover: '#F0C97A',
          green: '#52A876',
          blue: '#4A80C4'
        }
      },
    },
  },
  plugins: [],
}

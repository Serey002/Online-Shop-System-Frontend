/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EA580C',
          light: '#F97316',
          dark: '#C2410C'
        }
      }
    },
  },
  plugins: [],
}
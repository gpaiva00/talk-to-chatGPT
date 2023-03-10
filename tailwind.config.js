/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{tsx,css,ts,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

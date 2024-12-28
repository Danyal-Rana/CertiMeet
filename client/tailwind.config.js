/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        custom: '#000000', // Replace with your primary color
      },
    },
  },
  plugins: [],
}
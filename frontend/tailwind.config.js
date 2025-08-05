/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uber: {
          black: '#000000',
          white: '#FFFFFF',
          dark: '#1d1d1d',
          light: '#f5f5f5',
          green: '#1aae4c',
          blue: '#1fbbd3',
          yellow: '#ffc72c',
          orange: '#ff6900',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
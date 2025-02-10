/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['"Cairo"', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [
    require('@kamona/tailwindcss-perspective'),
    // ...
  ],
}


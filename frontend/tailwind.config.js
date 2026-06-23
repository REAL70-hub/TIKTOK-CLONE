/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00f7ef',
        secondary: '#25f4ee',
        dark: '#0a0a0a',
        darker: '#050505',
      },
      backgroundColor: {
        primary: '#00f7ef',
        secondary: '#25f4ee',
        dark: '#0a0a0a',
      },
    },
  },
  plugins: [],
};
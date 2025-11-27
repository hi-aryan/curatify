/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#2F2F2F',
        light: '#FAFFEC', /* old one was F8FFE5 */
        green: '#6CE395',
        blue: '#2757B2',
        pink: '#EF476F',
      },
    },
  },
  plugins: [],
};


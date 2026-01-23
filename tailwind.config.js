/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          primary: '#7689DE',
        },
        peach: {
          primary: '#F8A88A',
          dark: '#F69170',
        },
        nature: {
          primary: '#7BC77B',
        },
        light: {
          bg: '#F5F5F5',
        },
        dark: {
          text: '#4A4A4A',
        },
      },
      fontFamily: {
        heading: ['Quicksand', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

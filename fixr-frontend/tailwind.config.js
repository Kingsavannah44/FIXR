/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B5E20',   // FIXR green
        accent:  '#F9A825',   // FIXR gold
        dark:    '#0D1B2A',
      },
    },
  },
  plugins: [],
};

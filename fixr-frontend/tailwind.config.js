/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: '#1B5E20',   // FIXR green
        accent:  '#F9A825',   // FIXR gold
        dark:    '#0D1B2A',
        surface: '#111827',
        border:  '#1f2937',
      },
      letterSpacing: {
        tighter: '-0.025em',
        tight:   '-0.015em',
      },
      boxShadow: {
        'glow-accent':  '0 0 40px -10px rgba(249,168,37,0.35)',
        'glow-primary': '0 0 40px -10px rgba(27,94,32,0.4)',
        'card':         '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':   '0 8px 40px rgba(0,0,0,0.55)',
      },
    },
  },
  plugins: [],
};

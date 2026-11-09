/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#171a1b',
          900: '#202426',
          800: '#2b3032',
          700: '#45494a',
        },
        stone: {
          50: '#faf9f6',
          100: '#f2efe9',
          200: '#e4e0d8',
          300: '#d9d5cd',
          600: '#77736d',
          700: '#57534d',
        },
        brand: '#203642',
        charcoal: '#211f1c',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'scroll-cue': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'scroll-nudge': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(3px)', opacity: '0.6' },
        },
        'menu-reveal': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'scroll-cue': 'scroll-cue 2.4s cubic-bezier(0.45, 0, 0.25, 1) infinite',
        'scroll-nudge': 'scroll-nudge 2.4s ease-in-out infinite',
        'menu-reveal': 'menu-reveal 280ms ease-out both',
      },
    },
  },
  plugins: [],
};

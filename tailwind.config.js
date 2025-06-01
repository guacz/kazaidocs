/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(240, 243, 250)',
          100: 'rgb(226, 232, 245)',
          200: 'rgb(198, 212, 235)',
          300: 'rgb(169, 188, 224)',
          400: 'rgb(141, 163, 214)',
          500: 'rgb(112, 133, 186)',
          600: 'rgb(84, 105, 141)',
          700: 'rgb(56, 84, 138)',
          800: 'rgb(39, 67, 125)',
          900: 'rgb(27, 46, 86)',
        },
        secondary: {
          50: 'rgb(241, 245, 249)',
          100: 'rgb(228, 235, 244)',
          200: 'rgb(201, 217, 234)',
          300: 'rgb(173, 198, 223)',
          400: 'rgb(146, 179, 212)',
          500: 'rgb(118, 139, 183)',
          600: 'rgb(84, 105, 141)',
          700: 'rgb(62, 84, 123)',
          800: 'rgb(47, 68, 102)',
          900: 'rgb(32, 52, 81)',
        },
        accent: {
          500: 'rgb(233, 76, 88)',
        },
        success: {
          500: 'rgb(34, 197, 94)',
        },
        warning: {
          500: 'rgb(234, 179, 8)',
        },
        error: {
          500: 'rgb(220, 38, 38)',
        },
        background: 'rgb(250, 250, 250)',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
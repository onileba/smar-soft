/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefaf8',
          100: '#d8f4ef',
          200: '#b1e9df',
          300: '#7ad5c7',
          400: '#4fd1c5',
          500: '#1ea89b',
          600: '#177f76',
          700: '#135f5a',
          800: '#124b48',
          900: '#113d3b',
        },
        ink: {
          700: '#314158',
          800: '#1a2740',
          900: '#101a2e',
          950: '#0b1220',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

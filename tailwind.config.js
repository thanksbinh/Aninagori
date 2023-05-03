/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "translateY(0) rotate(2deg)" },
          "50%": { transform: "translateY(-40%) rotate(-2deg)" }
        }
      },
      animation: {
        wiggle: "wiggle 200ms ease-in-out"
      },
      colors: {
        'ani-black': '#191c21',
        'ani-light-gray': '#373c47',
        'ani-gray': '#212733',
        'ani-text-white': '#ffffff',
        'ani-text-gray': '#9ca3af',
      },
    },
  },
  plugins: [],
};

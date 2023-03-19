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
      backgroundImage: (theme) => ({
        'login-bg': "url('/wallpaper.png')",
      }),
      colors: {
        'ani-gray': '#212733',
        'ani-light-gray': '#4e5d78',
        'ani-black': '#191c21',
        'ani-text-gray': '#dddede'
      },
    },
  },
  plugins: [],
};

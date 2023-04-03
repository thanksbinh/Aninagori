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
        'ani-black': '#191c21',
        'ani-light-gray': '#373c47',
        'ani-gray': '#212733',
        'ani-text-main': '#ffffff'
      },
    },
  },
  plugins: [],
};

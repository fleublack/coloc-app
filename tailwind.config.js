/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0f0f0f",
        lightGray: "#1c1c1c",
        accentBlue: "#00bcd4",
        accentOrange: "#e07a5f",
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

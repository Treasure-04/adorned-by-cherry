/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
           colors: {
        ink: {
          DEFAULT: "#1C1420",
          light: "#2A1F2C",
          deep: "#130D16",
        },
        gold: {
          DEFAULT: "#E3A579",
          soft: "#EDC1A0",
        },
        blush: {
          DEFAULT: "#E8C4C0",
          rose: "#D9A79C",
        },
        ivory: "#F5EFE6",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
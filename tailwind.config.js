/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#091E42",
        light: "#393E46",
        gray1: "#B3BAC5",
        gray2: "#97A0AF",
        gray3: "#5E6C84",
        blue: "#2466EA",
        buttonEnabled: "#42B040",
        buttonDisabled: "#A1D8A0"
      },
    },
  },
  plugins: [],
};
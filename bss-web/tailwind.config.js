/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: "#523794",
        navy: "#0F172E",
        sky: "#5288C7",
        magenta: "#B73593",
      },
    },
    fontFamily: {
      sans: ["Inter"],
      serif: ["EB Garamond"],
      display: ["Agatho", "serif"],
    },
    screens: {
      sm: "576px",
      md: "960px",
      lg: "1440px",
    },
  },
  plugins: [],
};

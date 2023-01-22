/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      desktop: "1024px",
      md: "768px",
      sm: "640px",
      lg: "1024px",
    },
    extend: {},
  },
  plugins: [],
};

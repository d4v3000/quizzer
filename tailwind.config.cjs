/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: "translateY(-30px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        slideDownAndFade:
          "slideDownAndFade 600ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

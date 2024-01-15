/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // enable dark mode
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%":{
            opacity: .1
          },
          "20%": {
            opacity: 1
          },
          "100%": {
            opacity: .1
          }
        },
        pulse: {
"0%":  {transform: 'scale(0.5)', opacity: 0},
'50%': { transform: "scale(1)",
  opacity: 1},
  "100%": {
    transform: "scale(1.3)",
    opacity: 0
}
        }
      },
      colors: {
        formBack: "hsl(218deg 50% 91%)",
        loginRegister: "#f1f7fe",
        formBtn: "#3e4684",
        sidebar: "#F0F0F0",
        name: "#4399FF",
        message: "#959595",
        navbg: "#F0F0F0",
      },
    },
  },
  plugins: [
    require('tailwindcss-animation-delay')
  ],
};

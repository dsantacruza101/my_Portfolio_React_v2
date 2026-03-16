/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores personalizados para tu marca personal
        primary: "#3b82f6",
        secondary: "#2dd4bf",
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./NEFA/**/*.{js,ts,jsx,tsx,mdx}", // Añadido por si acaso
  ],
  theme: {
    extend: {
      colors: {
        nefa: {
          bg: '#0a0f1c',
          card: '#111827',
          cyan: '#00f0ff',
          purple: '#b026ff',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.2)',
        'neon-purple': '0 0 10px rgba(176, 38, 255, 0.5), 0 0 20px rgba(176, 38, 255, 0.2)',
      }
    },
  },
  plugins: [],
}
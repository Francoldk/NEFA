/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./NEFA/**/*.{js,ts,jsx,tsx,mdx}", // Tu carpeta
  ],
  theme: {
    extend: {
      colors: {
        nefa: {
          bg: '#060b14',      // Fondo muy oscuro
          card: '#0d1424',    // Fondo de tarjeta
          border: '#1f2937',  // Bordes
          cyan: '#00e5ff',    // Neón Cyan
          purple: '#b026ff',  // Neón Púrpura
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.1)',
        'neon-purple': '0 0 15px rgba(176, 38, 255, 0.3), inset 0 0 10px rgba(176, 38, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
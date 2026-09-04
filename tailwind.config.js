/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2563EB',
        'primary-green': '#10B981',
        'primary-orange': '#F59E0B',
        'primary-purple': '#8B5CF6',
      },
      borderRadius: {
        '20': '20px',
      }
    },
  },
  plugins: [],
}

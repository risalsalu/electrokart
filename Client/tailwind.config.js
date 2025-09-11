export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#2c3e50',
        accent: '#e74c3c',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // adjust based on your setup
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
};
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'zoom-fade': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'zoom-fade': 'zoom-fade 0.3s ease-out forwards',
      },
    },
  },
};

const { plugin } = require("postcss");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' }
        },
        'celebration-popup': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        confetti: 'confetti 3s ease-in-out forwards',
        'celebration-popup': 'celebration-popup 0.5s ease-out forwards'
      }
    }
  },
  plugins:[]
 
}
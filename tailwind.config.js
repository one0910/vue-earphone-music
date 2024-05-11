/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" }
      },
      keyframes: {
        "wavey": {
          '0%,100%': {
            transform: 'scaleY(0.5)'
          },
          '50%': {
            transform: 'scaleY(1.5)'
          }
        }
      },
      animation: {
        wavey: "wavey 800ms linear infinite",
      },
      animationPlayState: {
        paused: 'paused',
        running: 'running'
      }
    },

  },
  plugins: [
    require("./plugins/animationDelay"),
    require("./plugins/openVariant"),
    require("./plugins/customizedCSS"),
    require("./plugins/buttonPlugin"),
  ],
}


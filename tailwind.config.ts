import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        catCare: {
          "primary": "#60a5fa", // light blue
          "secondary": "#f472b6", // pink
          "accent": "#34d399", // green
          "neutral": "#f3f4f6", // gray-100
          "base-100": "#ffffff", // white
        },
      },
      "light",
      "dark",
      "cupcake"
    ],
  },
} satisfies Config
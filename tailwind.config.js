import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        caveat : ['Caveat', 'cursive'],
        
      }
    },
  },
  plugins: [
    daisyui,
    
  ],
    daisyui: {
    themes: ["light", "dark"],
  },
}
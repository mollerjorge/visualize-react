/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "body-1": "#131A27",
        "body-2": "#06090F",
        "bg-dark-1": "#222832",
        "light-1": "#3b3b3b",
        "purple-1": '#9A37F6',
        "purple-2": '#C084FC',
      },
      fontFamily: {
        'thiccboi': 'Thiccboi'
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 120s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
        'border-spin': 'border-spin 15s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'border-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};

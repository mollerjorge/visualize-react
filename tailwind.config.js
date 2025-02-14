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
        marquee: 'marquee 25s linear infinite',
        marquee2: 'marquee2 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};

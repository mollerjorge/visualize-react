/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "body-1": "#131A27",
        "body-2": "#06090F",
        "purple-1": '#A855F7',
        "purple-2": '#C084FC',
      },
      fontFamily: {
        'thiccboi': 'Thiccboi'
      }
    },
  },
  plugins: [],
};

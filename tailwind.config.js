/** @type {import('tailwindcss').Config} */
module.exports = {
  // यह लाइन सबसे ज़रूरी है - यह Tailwind को बताती है कि कोड कहाँ ढूँढना है
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // आपके कस्टम फॉन्ट्स
      fontFamily: {
        valentine: ['"Pacifico"', 'cursive'], 
        bubbly: ['"Fredoka"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
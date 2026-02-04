// app/layout.js
import { Pacifico, Fredoka } from 'next/font/google'
import "./globals.css";

// 1. Configure the Cursive Font (for Titles)
const pacifico = Pacifico({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico', // This creates a CSS variable
})

// 2. Configure the Bubbly Font (for Text)
const fredoka = Fredoka({ 
  subsets: ['latin'], 
  variable: '--font-fredoka',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 3. Add both variables to the body class */}
      <body className={`${pacifico.variable} ${fredoka.variable}`}>
        {children}
      </body>
    </html>
  );
}
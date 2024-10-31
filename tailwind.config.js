import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        prompt: ["var(--font-prompt)"],
        sarabun: ["var(--font-sarabun)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            50: "#FAF6E9",
            100: "#F6EFD7",
            200: "#EFE2B8",
            300: "#E7D594",
            400: "#DFC772",
            500: "#D4AF37",
            600: "#BC9A2F",
            700: "#A38529",
            800: "#8B7023",
            900: "#725C1D",
            foreground: "#000000",
            DEFAULT: "#D4AF37",
          },
          focus: "#F6EFD7",
        }
      }
    }
  })],
}

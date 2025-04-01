import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        prompt: ["var(--font-prompt)"],
        sarabun: ["var(--font-sarabun)"],
      },
      animation: {
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
          '100%': {
            'background-position': '0% 50%'
          }
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '0.6',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.9',
            transform: 'scale(1.1)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'shine': {
          '0%': {
            'background-position': '200% center',
          },
          '100%': {
            'background-position': '-200% center',
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
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

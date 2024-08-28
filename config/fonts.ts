import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Prompt as FontPrompt,
  Sarabun as FontSarabun,
} from "next/font/google";

export const fontPrompt = FontPrompt({
  subsets: ["thai"],
  weight: "400",
  variable: "--font-prompt"
});

export const fontSarabun = FontSarabun({
  subsets: ["thai"],
  weight: "400",
  variable: "--font-sarabun"
})

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

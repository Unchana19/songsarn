import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontSarabun } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: "Songsarn",
    template: `%s - Songsarn`,
  },
  description: "siteConfig.description",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sarabun antialiased",
          fontSarabun.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontPrompt, fontSans, fontSarabun } from "@/config/fonts";
import NavbarComponent from "@/components/navbar";
import MenuTabsComponent from "@/components/menu-tabs";

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

export default function RootLayout({
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
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen items-center jus overflow-x-hidden">
            <NavbarComponent />
            <MenuTabsComponent />
            <main className="container mx-auto max-w-7xl pt-8 px-6 flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              Footer
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

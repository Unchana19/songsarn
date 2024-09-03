import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontSarabun } from "@/config/fonts";
import NavbarComponent from "@/components/navbar";
import MenuTabsComponent from "@/components/menu-tabs";
import FooterComponent from "@/components/footer";

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
          fontSarabun.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col h-screen items-center jus overflow-x-hidden">
            <NavbarComponent />
            <MenuTabsComponent />
            <main className="container mx-auto max-w-7xl pt-8 px-6 mb-40 flex-grow">
              {children}
            </main>
            <FooterComponent />
          </div>
        </Providers>
      </body>
    </html>
  );
}

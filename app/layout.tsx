import "@/styles/globals.css";
import type { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontPrompt } from "@/config/fonts";
import NavbarComponent from "@/components/navbar";
import FooterComponent from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Songsarn",
    template: "%s - Songsarn",
  },
  description: "songsarn e-comerce platform to sell shrine",
  icons: {
    icon: "/favicon.png",
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
          "min-h-screen w-full bg-background font-prompt antialiased",
          fontPrompt.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <NavbarComponent />
          <div className="w-full mb-60">{children}</div>
          <FooterComponent />
        </Providers>
      </body>
    </html>
  );
}

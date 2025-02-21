"use client";

import type * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <SessionProvider>
        <NextThemesProvider {...themeProps}>
          <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
        </NextThemesProvider>
      </SessionProvider>
    </Provider>
  );
}

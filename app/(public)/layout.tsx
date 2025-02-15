import MenuTabsComponent from "@/components/menu-tabs";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="relative flex flex-col min-h-screen items-center jus overflow-x-hidden">
      <MenuTabsComponent />
      <main className="container mx-auto max-w-7xl pt-8 px-6 flex-grow min-h-screen h-full">
        {children}
      </main>
    </div>
  );
}

import FooterComponent from "@/components/footer";
import MenuTabsComponent from "@/components/menu-tabs";
import NavbarComponent from "@/components/navbar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="relative flex flex-col min-h-screen items-center jus overflow-x-hidden">
      <NavbarComponent />
      <MenuTabsComponent />
      <main className="container mx-auto max-w-7xl pt-8 px-6 mb-40 flex-grow min-h-screen h-full">
        {children}
      </main>
      <FooterComponent />
    </div>
  );
}

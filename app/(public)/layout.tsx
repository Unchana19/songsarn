import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <main className="container mx-auto max-w-7xl pt-8 px-6 flex-grow min-h-screen h-full">
      {children}
    </main>
  );
}

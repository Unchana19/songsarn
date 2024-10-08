import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="relative flex flex-col h-screen items-center jus overflow-x-hidden">
      <div className="container mx-auto max-w-7xl pt-8 px-6 mb-40 flex-grow">
        {children}
      </div>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";

export default function FooterComponent() {
  const pathname = usePathname();

  if (pathname === "/sign-in") return null;
  return (
    <footer className="flex bg-gray-200 px-5 pt-10 pb-20 gap-10 w-full justify-center">
      <div className="md:grid md:grid-cols-5 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">Contact</h2>
          <p className="">ที่อยู่</p>
          <p className="">เบอร์โทร</p>
          <p className="">อีเมล</p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">Office hours</h2>
          <p className="">Everyday 00:00 - 23:59</p>
        </div>
      </div>
    </footer>
  );
}

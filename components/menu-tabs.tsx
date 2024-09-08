"use client";

import { Button } from "@nextui-org/button";
import { FaBookOpen } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import { FaInbox } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

const menuItems = [
  { label: "Shop by catalog", icon: FaBookOpen, href: "/catalog" },
  { label: "Create your own shrine", icon: FaPencil, href: "/create-shrine" },
  { label: "My order", icon: FaInbox, href: "/my-order" },
  { label: "Checking delivery price", icon: FaTruck, href: "/delivery-price" },
  { label: "Tips", icon: MdTipsAndUpdates, href: "/tips" },
];

export default function MenuTabsComponent() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/sign-in") return null;
  return (
    <div className="md:flex gap-2 xl:max-w-6xl md:max-w-3xl hidden items-center border-b-1 overflow-x-auto px-10 min-h-20">
      <div className="flex gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant={pathname.includes("/all-products") ? "flat" : "light"}
              color={pathname.includes("/all-products") ? "primary" : "default"}
            >
              <FaShoppingBag />
              <p>Shop products</p>
              <RiArrowDropDownLine size={25} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Action event example"
            onAction={(key) => router.push(`/all-products/${key}`)}
          >
            <DropdownItem key="">All products</DropdownItem>
            <DropdownItem key="brahma-shrine">ศาลพระพรหม</DropdownItem>
            <DropdownItem key="spirit-house">ศาลพระภูมิ</DropdownItem>
            <DropdownItem key="shrine">ศาลเจ้าที่</DropdownItem>
            <DropdownItem key="grandparent-shrine">ศาลตายาย</DropdownItem>
            <DropdownItem key="table">โต๊ะหน้าศาล</DropdownItem>
            <DropdownItem key="equipment">อุปกรณ์ประกอบหน้าศาล</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {menuItems.map((menu) => (
          <Button
            as={Link}
            href={menu.href}
            key={menu.label}
            variant={pathname === menu.href ? "flat" : "light"}
            color={pathname === menu.href ? "primary" : "default"}
            isDisabled={pathname === menu.href}
            className="opacity-100"
          >
            <menu.icon />
            <p>{menu.label}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}

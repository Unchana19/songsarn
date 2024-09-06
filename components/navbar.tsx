"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import {
  FaBasketShopping,
  FaBookOpen,
  FaInbox,
  FaPencil,
  FaTruck,
} from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import { MdOutlineFavorite, MdTipsAndUpdates } from "react-icons/md";

import { SearchIcon } from "./icons/search-icon";
import { usePathname } from "next/navigation";
import { FaShoppingBag } from "react-icons/fa";

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "All products", icon: FaShoppingBag, href: "/all-products" },
    { label: "Shop by catalog", icon: FaBookOpen, href: "/catalog" },
    { label: "Create your own shrine", icon: FaPencil, href: "/create-shrine" },
    { label: "My order", icon: FaInbox, href: "/my-order" },
    {
      label: "Checking delivery price",
      icon: FaTruck,
      href: "/delivery-price",
    },
    { label: "Tips", icon: MdTipsAndUpdates, href: "/tips" },
    { label: "Sign In", icon: PiSignInBold, href: "/sign-in" },
  ];

  if (pathname === "/sign-in") return null;
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            Songsarn
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Input
            color="primary"
            placeholder="Find your favorite shrine"
            radius="full"
            startContent={
              <SearchIcon className="text-amber/50 mb-0.5 text-[#D4AF37] pointer-events-none flex-shrink-0" />
            }
            type="text"
            variant="bordered"
          />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button isIconOnly variant="light">
            <FaBasketShopping size={20} color="#D4AF37" />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/favorite"
            color="primary"
            isDisabled={pathname === "/favorite"}
            className="opacity-100"
            isIconOnly
            variant={pathname === "/favorite" ? "flat" : "light"}
          >
            <MdOutlineFavorite size={20} color="#D4AF37" />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/sign-in" variant="flat">
            <p className="text-black">Sign In</p>
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((menu, index) => (
          <NavbarMenuItem key={`${menu}-${index}`}>
            <Button
              fullWidth
              as={Link}
              href={menu.href}
              key={menu.label}
              variant={pathname === menu.href ? "flat" : "light"}
              color={pathname === menu.href ? "primary" : "default"}
            >
              <div className="flex w-full items-center gap-4">
                <menu.icon />
                <p>{menu.label}</p>
              </div>
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

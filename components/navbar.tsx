"use client";

import React, { useEffect, useState } from "react";
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
import { MdOutlineFavorite, MdTipsAndUpdates } from "react-icons/md";

import { usePathname } from "next/navigation";
import { FaShoppingBag } from "react-icons/fa";
import { loginPath, signUpPath } from "@/constant/auth-path";
import { signOut, useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { User } from "@/interfaces/user.interface";
import { SearchIcon } from "./icons/search-icon";

export default function NavbarComponent() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      if (status === "authenticated" && session?.userId) {
        try {
          const response = await fetch(`/api/users/${session.userId}`);

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [status, session]);

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
  ];

  if (pathname === loginPath || pathname === signUpPath) return null;
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
      <NavbarContent justify="end" className="gap-2 md:gap-5">
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
          <Button
            as={Link}
            href="/cart"
            color="primary"
            isDisabled={pathname === "/cart"}
            className="opacity-100"
            isIconOnly
            variant={pathname === "/cart" ? "flat" : "light"}
          >
            <FaBasketShopping size={20} color="#D4AF37" />
          </Button>
        </NavbarItem>
        {user === null ? (
          <NavbarItem className="flex gap-2">
            <div>
              <Button
                as={Link}
                color="primary"
                href="/sign-up"
                variant="light"
                className="border-primary-50 hidden lg:flex"
              >
                <p className="text-primary text-sm">Sign up</p>
              </Button>
            </div>
            <Button as={Link} color="primary" href="/login" variant="flat">
              <p className="text-black text-sm">Log in</p>
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  src={
                    user.img ??
                    `https://songsarn-project.s3.ap-southeast-1.amazonaws.com/default-profile.jpg`
                  }
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  onClick={() => signOut()}
                  key="logout"
                  className="text-danger"
                  color="danger"
                >
                  <p>Log Out</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((menu, index) => (
          <NavbarMenuItem key={`${menu}-${index}`}>
            <Button
              fullWidth
              as={Link}
              href={menu.href}
              key={menu.label}
              isDisabled={pathname === menu.href}
              className="opacity-100"
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

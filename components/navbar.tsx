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
import { FaBasketShopping } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { Skeleton } from "@nextui-org/skeleton";
import { User } from "@/interfaces/user.interface";
import { Image } from "@nextui-org/image";
import {
  menuItemsManager,
  menuItemsCustomer,
} from "@/constants/menu-tabs-items";
import { MenuItems } from "@/types";
import { FaShoppingBag } from "react-icons/fa";

export default function NavbarComponent() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoading = status === "loading";
  const isManager = session?.role === "manager";

  let menuItems: MenuItems[];
  if (isManager) {
    menuItems = menuItemsManager;
  } else {
    menuItems = menuItemsCustomer;
  }

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

  if (pathname === "/login" || pathname === "/sign-up") {
    return null;
  }

  const renderAuthUI = () => {
    if (isLoading) {
      return (
        <NavbarItem className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
        </NavbarItem>
      );
    }

    if (!user && !isLoading) {
      return (
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
      );
    }

    return (
      <NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              src={user?.img ?? "/default-profile/default-profile.jpg"}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              as={Link}
              href="/profile"
              key="profile"
              color="primary"
            >
              <p className="text-black">Edit profile</p>
            </DropdownItem>
            <DropdownItem
              as={Link}
              href="/address"
              key="address"
              color="primary"
            >
              <p className="text-black">Address</p>
            </DropdownItem>
            <DropdownItem
              onClick={() => signOut()}
              key="logout"
              className="text-danger"
              color="danger"
            >
              <p>Log out</p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    );
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            <Image src="/logo/songsarn-logo.png" height={65} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="start"
      />
      <NavbarContent justify="end" className="gap-2 md:gap-5">
        {session?.role === "customer" ? (
          <NavbarItem className="flex gap-2">
            <Button
              as={Link}
              href="/cart"
              color="primary"
              isDisabled={pathname === "/cart"}
              className={`opacity-100 ${pathname === "/cart" ? "border-1 border-primary" : ""}`}
              isIconOnly
              variant={pathname === "/cart" ? "flat" : "light"}
            >
              <FaBasketShopping size={20} color="#D4AF37" />
            </Button>
          </NavbarItem>
        ) : null}
        {renderAuthUI()}
      </NavbarContent>
      <NavbarMenu>
        {!isManager && (
          <NavbarMenuItem>
            <Button
              fullWidth
              as={Link}
              href="/all-products"
              key="all-products"
              isDisabled={pathname === "/all-products"}
              className="opacity-100"
              variant={pathname === "/all-products" ? "flat" : "light"}
              color={pathname === "/all-products" ? "primary" : "default"}
            >
              <div className="flex w-full items-center gap-4">
                <FaShoppingBag />
                <p>All products</p>
              </div>
            </Button>
          </NavbarMenuItem>
        )}
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

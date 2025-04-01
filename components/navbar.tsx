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
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { FaBasketShopping } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Skeleton } from "@heroui/skeleton";
import { Image } from "@heroui/image";
import { Badge } from "@heroui/badge";
import {
  menuItemsManager,
  menuItemsCustomer,
} from "@/constants/menu-tabs-items";
import type { MenuItems } from "@/types";
import { FaShoppingBag } from "react-icons/fa";
import {
  useFetchCountCartsByIdQuery,
  useFetchProductsQuery,
  useFetchUserQuery,
} from "@/store";
import { Input } from "@heroui/input";
import { SearchIcon } from "./icons/search-icon";
import type { Product } from "@/interfaces/product.interface";
import ImagePlaceholder from "./image-placeholder";
import { MdFavorite } from "react-icons/md";

export default function NavbarComponent() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { data: user, isLoading: isLoadingUser } = useFetchUserQuery(
    session?.userId ?? ""
  );

  const { data: products } = useFetchProductsQuery({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredProducts = products
    ?.filter((product: Product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const { currentData: countOfCart } = useFetchCountCartsByIdQuery({
    userId: session?.userId ?? "",
    accessToken: session?.accessToken ?? "",
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isManager = session?.role === "manager";

  let menuItems: MenuItems[];
  if (isManager) {
    menuItems = menuItemsManager;
  } else {
    menuItems = menuItemsCustomer;
  }

  if (pathname === "/login" || pathname === "/sign-up") {
    return null;
  }

  const renderAuthUI = () => {
    if (isLoadingUser) {
      return (
        <NavbarItem className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
        </NavbarItem>
      );
    }

    if (!user && !isLoadingUser) {
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
              onPress={() => signOut()}
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

      <NavbarContent justify="center" className="max-w-lg w-full">
        <NavbarItem className="relative w-full">
          <Input
            startContent={<SearchIcon />}
            placeholder="Find your favorite shrine"
            radius="full"
            variant="bordered"
            color="primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full"
          />
          {showSuggestions && filteredProducts?.length > 0 && (
            <div className="flex flex-col absolute w-full bg-white shadow-lg rounded-xl mt-1 p-2 border border-gray-200 z-50 max-h-[60vh] overflow-y-auto">
              {filteredProducts.map((product: Product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="w-full"
                >
                  <div className="p-1.5 sm:p-2 hover:bg-primary-100 cursor-pointer flex items-center w-full gap-2 sm:gap-3 rounded-lg">
                    <div className="min-w-[50px] sm:min-w-[60px]">
                      {product.img ? (
                        <Image
                          src={product.img}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]"
                        />
                      ) : (
                        <ImagePlaceholder
                          name={product.name.charAt(0).toUpperCase()}
                          classNames="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]"
                        />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {product.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2 md:gap-5">
        {session?.role === "customer" ? (
          <NavbarItem className="flex gap-2">
            <Button
              as={Link}
              href="/like"
              color="primary"
              isDisabled={pathname === "/like"}
              className={`opacity-100 ${pathname === "/like" ? "border-1 border-primary" : ""}`}
              isIconOnly
              variant={pathname === "/like" ? "flat" : "light"}
            >
              <MdFavorite size={20} color="#D4AF37" />
            </Button>
            <Badge
              content={countOfCart}
              color="primary"
              size="md"
              isInvisible={!countOfCart || countOfCart <= 0}
              placement="top-right"
            >
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
            </Badge>
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
        {menuItems.map((menu) => (
          <NavbarMenuItem key={"menu.href"}>
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

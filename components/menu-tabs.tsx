"use client";

import { Button } from "@heroui/button";
import { FaShoppingBag } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  menuItemsCustomer,
  menuItemsManager,
  menuItemsStaff,
} from "@/constants/menu-tabs-items";
import { useSession } from "next-auth/react";
import type { MenuItems } from "@/types";
import { Skeleton } from "@heroui/skeleton";
import type { Category } from "@/interfaces/category.interface";
import { useFetchProductCategoriesQuery } from "@/store";

export default function MenuTabsComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isCustomer = session?.role === "customer";
  const isManager = session?.role === "manager";
  const isStaff = session?.role === "staff";

  const { data: productCategories, isLoading } = useFetchProductCategoriesQuery(
    {}
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="md:flex gap-2 xl:max-w-6xl md:max-w-3xl hidden items-center border-b-1 overflow-x-auto px-10 min-h-20">
        <div className="flex gap-2">
          {[...Array(4)].map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton key={index} className="h-10 w-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  let menuItems: MenuItems[];
  if (isManager) {
    menuItems = menuItemsManager;
  } else if (isStaff) {
    menuItems = menuItemsStaff;
  } else {
    menuItems = menuItemsCustomer;
  }

  const dropdownItems = [
    { key: "", label: "All products" },
    ...(productCategories?.map((category: Category) => ({
      key: category.id,
      label: category.name,
    })) ?? []),
  ];

  return (
    <div className="md:flex w-full justify-center gap-2 xl:max-w-6xl md:max-w-3xl hidden items-center border-b-1 overflow-x-auto px-10 min-h-20">
      <div className="flex gap-2">
        {(isCustomer || status === "unauthenticated") && (
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant={pathname.includes("/all-products") ? "flat" : "light"}
                color={
                  pathname.includes("/all-products") ? "primary" : "default"
                }
              >
                <FaShoppingBag />
                <p>All products</p>
                <RiArrowDropDownLine size={25} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Product categories"
              onAction={(key) => router.push(`/all-products/${key}`)}
              items={dropdownItems}
            >
              {(item) => (
                <DropdownItem key={item.key}>{item.label}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        )}
        {menuItems.map((menu) => (
          <Button
            as={Link}
            href={menu.href}
            key={menu.label}
            variant={pathname.includes(menu.href) ? "flat" : "light"}
            color={pathname.includes(menu.href) ? "primary" : "default"}
            isDisabled={pathname.includes(menu.href)}
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

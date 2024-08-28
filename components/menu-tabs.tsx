import { Button } from "@nextui-org/button";
import { FaShop } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import { FaBasketShopping } from "react-icons/fa6";
import Link from "next/link";

const menuItems = [
  { label: "Shop products", icon: FaShop },
  { label: "Shop by catalog", icon: FaShoppingBag },
  { label: "Create your own shrine", icon: FaPencil },
  { label: "My order", icon: FaBasketShopping },
  { label: "Checking delivery price", icon: FaTruck },
  { label: "Tips", icon: MdTipsAndUpdates },
];

export default function MenuTabsComponent() {
  return (
    <div className="flex gap-2 xl:max-w-6xl md:max-w-2xl max-w-md items-center border-b-1 py-3 overflow-x-auto whitespace-nowrap px-5">
      <div className="flex">
        {menuItems.map((menu) => (
          <Button as={Link} href="#" key={menu.label} variant="light">
            <menu.icon />
            <p>{menu.label}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}

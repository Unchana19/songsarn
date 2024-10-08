import { FaBookOpen, FaBoxes, FaFileInvoice, FaHistory, FaInbox, FaMoneyBillWave, FaTruck, FaWarehouse } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { MdTipsAndUpdates } from "react-icons/md";

export const menuItemsCustomer = [
  { label: "Shop by catalog", icon: FaBookOpen, href: "/catalog" },
  { label: "Create your own shrine", icon: FaPencil, href: "/create-shrine" },
  { label: "My order", icon: FaInbox, href: "/my-order" },
  { label: "Checking delivery price", icon: FaTruck, href: "/delivery-price" },
  { label: "Tips", icon: MdTipsAndUpdates, href: "/tips" },
];

export const menuItemsManager = [
  {
    label: "Product & Component",
    icon: FaBoxes,
    href: "/manager/product-component",
  },
  {
    label: "Purchase order",
    icon: FaFileInvoice,
    href: "/manager/purchase-order",
  },
  {
    label: "Stock",
    icon: FaWarehouse,
    href: "/manager/stock",
  },
  {
    label: "History",
    icon: FaHistory,
    href: "/manager/history",
  },
  {
    label: "Transaction",
    icon: FaMoneyBillWave,
    href: "/manager/transaction",
  },
];

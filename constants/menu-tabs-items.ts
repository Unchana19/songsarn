import {
  FaBoxes,
  FaFileInvoice,
  FaHistory,
  FaInbox,
  FaMoneyBillWave,
  FaWarehouse,
} from "react-icons/fa";
import { FaPencil, FaUserGear } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";

export const menuItemsCustomer = [
  { label: "Create your own shrine", icon: FaPencil, href: "/create-shrine" },
  { label: "My order", icon: FaInbox, href: "/my-order" },
];

export const menuItemsManager = [
  {
    label: "Dashboard",
    icon: MdSpaceDashboard,
    href: "/manager/dashboard",
  },
  {
    label: "Manage Staff",
    icon: FaUserGear,
    href: "/manager/manage-staff",
  },
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

export const menuItemsStaff = [
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

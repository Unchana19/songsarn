import { SVGProps } from "react";
import { IconType } from "react-icons";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Product = {
  image: string;
  price: number;
  name: string;
  type: string;
};

export interface ProductType {
  id: string;
  image: string;
  label: string;
  type: "product" | "component"
}

export interface MenuItems {
  label: string;
  icon: IconType;
  href: string;
}

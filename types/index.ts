import { SVGProps } from "react";
import { IconType } from "react-icons";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface MenuItems {
  label: string;
  icon: IconType;
  href: string;
}

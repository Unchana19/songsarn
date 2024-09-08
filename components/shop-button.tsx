import { Button } from "@nextui-org/button";
import { FaCartPlus } from "react-icons/fa6";
import { MdFavoriteBorder } from "react-icons/md";

interface Props {
  size: "sm" | "md" | "lg";
}

export default function ShopButtonComponent({ size }: Props) {
  return (
    <div className="flex gap-2">
      <Button isIconOnly color="primary" size={size}>
        <FaCartPlus color="white" size={20} />
      </Button>
      <Button isIconOnly color="primary" variant="light" size={size}>
        <MdFavoriteBorder size={20} />
      </Button>
      <Button color="primary" size={size}>
        <p className="text-white">More detail</p>
      </Button>
    </div>
  );
}

import type { Product } from "@/interfaces/product.interface";
import { Button } from "@heroui/button";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

interface Props {
  product: Product;
  isLiked: boolean;
  handleLike: (productId: string) => void;
  isLoadingLike: boolean;
  handleAddToCart: (product: Product) => void;
  isLoadingAddToCart: boolean;
}

export default function ShopButton({
  product,
  isLiked,
  handleLike,
  isLoadingLike,
  handleAddToCart,
  isLoadingAddToCart,
}: Props) {
  return (
    <div className="w-full flex justify-between">
      <div className="flex gap-2">
        <Button
          as={Link}
          href={`/product/${product.id}`}
          color="primary"
          variant="bordered"
          size="lg"
          className="w-32"
        >
          <p>See detail</p>
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLike(product.id);
          }}
          isIconOnly
          variant="light"
          color="primary"
          radius="full"
          size="lg"
          isLoading={isLoadingLike}
        >
          {isLiked ? <MdFavorite size={28} /> : <MdFavoriteBorder size={28} />}
        </Button>
      </div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart(product);
        }}
        radius="full"
        className="z-10"
        isIconOnly
        color="primary"
        size="lg"
        isLoading={isLoadingAddToCart}
      >
        <FaCartPlus color="white" size={20} />
      </Button>
    </div>
  );
}

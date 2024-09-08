import { Product } from "@/types";
import { Image } from "@nextui-org/image";
import ShopButtonComponent from "./shop-button";
import { formatNumberWithComma } from "@/utils/num-with-comma";

interface Props {
  product: Product;
}

export default function ProductCardLargeComponent({ product }: Props) {
  return (
    <div className="flex flex-col md:flex-row w-full items-center">
      <div className="md:w-1/2 relative flex items-center justify-center">
        <div className="absolute top-5 right-8 bg-red-500 py-2 px-8 z-10 rounded-2xl">
          <p className="text-white">Top seller</p>
        </div>
        <Image src={product.image} className="z-0" />
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <h2 className="font-bold text-xl md:text-2xl leading-relaxed">
          {product.name}
        </h2>
        <h3 className="md:text-xl font-bold mt-1">
          {formatNumberWithComma(product.price)}
        </h3>
        <ShopButtonComponent size="md" />
      </div>
    </div>
  );
}

import { Button } from "@nextui-org/button";
import ProductCardSmallComponent from "./product-card-small";
import { ReactNode } from "react";
import { Product, ProductType } from "@/types";
import Link from "next/link";

interface Props {
  productType?: ProductType;
  cardButton: ReactNode;
  isTopSeller?: boolean;
  products: Product[];
}

export default function ProductSlideComponent({
  productType,
  cardButton,
  isTopSeller,
  products,
}: Props) {
  return (
    <div className="flex flex-col my-10">
      {productType && (
        <div className="flex items-center justify-between my-5">
          <p className="font-bold text-lg">{productType.label}</p>
          <Button
            as={Link}
            href={`/all-products/${productType.key}`}
            color="primary"
            className="text-white"
          >
            <p>See all {productType.label}</p>
          </Button>
        </div>
      )}
      <div className="flex md:justify-around overflow-x-auto gap-10 px-5">
        {products.map((product: Product) => (
          <ProductCardSmallComponent
            key={product.name}
            isTopSeller={isTopSeller && product === products[0]}
            image={product.image}
            price={product.price}
            name={product.name}
            cardButton={cardButton}
          />
        ))}
      </div>
    </div>
  );
}

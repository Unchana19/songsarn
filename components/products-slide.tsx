import { Button } from "@nextui-org/button";
import ProductCardSmallComponent from "./product-card-small";
import { ReactNode } from "react";
import { Product } from "@/types";

interface Props {
  productType?: string;
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
    <div className="flex flex-col my-5">
      {productType && (
        <div className="flex items-center justify-between my-2">
          <p className="font-bold text-lg">{productType}</p>
          <Button color="primary">
            <p>See all {productType}</p>
          </Button>
        </div>
      )}
      <div className="flex justify-around overflow-x-auto gap-4">
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

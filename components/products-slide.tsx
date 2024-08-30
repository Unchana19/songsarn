import { Button } from "@nextui-org/button";
import ProductCardSmallComponent from "./product-card-small";

interface Props {
  productType?: string;
}

export default function ProductSlideComponent({ productType }: Props) {
  return (
    <div className="flex flex-col my-5">
      {productType && (
        <div className="flex items-center justify-between my-2">
          <p>{productType}</p>
          <Button color="primary">
            <p>See all {productType}</p>
          </Button>
        </div>
      )}
      <div className="flex justify-around overflow-x-auto gap-4">
        <ProductCardSmallComponent
          isTopSeller
          image="/shrine/sarnpraprom.png"
          price={45000}
          name="ศาลพระพรหมทรงไทย"
        />
        <ProductCardSmallComponent
          image="/shrine/sarnpraprom.png"
          price={45000}
          name="ศาลพระพรหมทรงไทย"
        />
        <ProductCardSmallComponent
          image="/shrine/sarnpraprom.png"
          price={45000}
          name="ศาลพระพรหมทรงไทย"
        />
        <ProductCardSmallComponent
          image="/shrine/sarnpraprom.png"
          price={45000}
          name="ศาลพระพรหมทรงไทย"
        />
      </div>
    </div>
  );
}

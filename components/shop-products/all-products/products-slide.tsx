import { Button } from "@nextui-org/button";
import AllProductsCardComponent from "./all-products-card";

interface Props {
  productType: string;
}

export default function ProductSlideComponent({ productType }: Props) {
  return (
    <div className="flex flex-col my-5">
      <div className="flex items-center justify-between my-2">
        <p>{productType}</p>
        <Button color="primary">
          <p>See all {productType}</p>
        </Button>
      </div>
      <div className="flex justify-around overflow-x-auto gap-4">
        <AllProductsCardComponent
          isTopSeller
          image="/shrine/sarnpraprom.png"
          price={45000}
          name="ศาลพระพรหมทรงไทย"
        />
        <AllProductsCardComponent
          image="/shrine/sarnpraprom.png"
          price={45000}
          name="ศาลพระพรหมทรงไทย"
        />
        <AllProductsCardComponent
          image="/shrine/sarnpraprom.png"
          price={45000}
          name="ศาลพระพรหมทรงไทย"
        />
        <AllProductsCardComponent
          image="/shrine/sarnpraprom.png"
          price={45000}
          name="ศาลพระพรหมทรงไทย"
        />
      </div>
    </div>
  );
}

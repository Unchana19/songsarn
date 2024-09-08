import ProductCardLargeComponent from "@/components/product-card-large";
import ProductCardSmallComponent from "@/components/product-card-small";
import ShopButtonComponent from "@/components/shop-button";
import { productsAll } from "@/data/product-all";
import { productTypes } from "@/data/product-type";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Image } from "@nextui-org/image";

interface Props {
  params: { productType: string };
}

export default function ProductTypePage({ params }: Props) {
  const { productType } = params;

  const product = productTypes.find((p) => p.key === productType);
  const products = productsAll.filter((p) => p.type === productType);

  return (
    <div className="mb-40">
      <h3 className="font-bold text-xl my-5">{product?.label}</h3>
      <div className="flex flex-col md:flex-row flex-wrap w-full items-center gap-10 justify-between">
        {products.map((p, index) => {
          if (index === 0) {
            return (
              <ProductCardLargeComponent key={index} product={p} />
            );
          }
          return (
            <div key={index} className="md:w-3/12">
              <ProductCardSmallComponent
                image={p.image}
                price={p.price}
                name={p.name}
                cardButton={<ShopButtonComponent size="sm" />}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

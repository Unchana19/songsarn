import { Product } from "@/interfaces/product.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { ReactNode } from "react";
import ImagePlaceholder from "./image-placeholder";

interface Props {
  product: Product;
  isTopSeller?: boolean;
  cardButton: ReactNode;
}

export default function ProductCardSmall({
  product,
  isTopSeller,
  cardButton,
}: Props) {
  return (
    <Card
      isHoverable
      shadow="sm"
      className="cursor-pointer min-w-[200px]"
    >
      <CardHeader className="flex justify-center">
        {isTopSeller && (
          <div className="absolute top-2 right-2 bg-red-500 py-1 px-3 z-10 rounded-2xl">
            <p className="text-white text-sm">Top seller</p>
          </div>
        )}
        {product.img ? (
          <Image
            src={product.img}
            className="object-cover z-0"
            height={250}
            alt={product.name}
          />
        ) : (
          <ImagePlaceholder
            name={product.name.slice(0, 10)}
            classNames={"w-full h-[250px]"}
          />
        )}
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        <p>{product.name}</p>
        <h3 className="text-lg font-bold">
          {formatNumberWithComma(product.price)}
        </h3>
      </CardBody>
      <CardFooter className="flex gap-2">{cardButton}</CardFooter>
    </Card>
  );
}

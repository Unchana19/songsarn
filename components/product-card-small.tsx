import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { ReactNode } from "react";

interface Props {
  image: string;
  price: number;
  name: string;
  isTopSeller?: boolean;
  cardButton: ReactNode;
}

export default function ProductCardSmallComponent({
  image,
  price,
  name,
  isTopSeller,
  cardButton,
}: Props) {
  return (
    <Card isHoverable shadow="none" className="cursor-pointer min-w-[200px]">
      <CardHeader className="flex justify-center">
        {isTopSeller && (
          <div className="absolute top-2 right-2 bg-red-500 py-1 px-3 z-10 rounded-2xl">
            <p className="text-white text-sm">Top seller</p>
          </div>
        )}
        <Image
          src={image}
          className="object-cover z-0"
          width={150}
          alt={name}
        />
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        <p>{name}</p>
        <h3 className="text-lg font-bold">{formatNumberWithComma(price)}</h3>
      </CardBody>
      <CardFooter className="flex gap-2">{cardButton}</CardFooter>
    </Card>
  );
}

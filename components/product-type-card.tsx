import { ProductType } from "@/types";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import Link from "next/link";

interface Props {
  image: string;
  productType: ProductType
  isSelected?: boolean;
  canSelected?: boolean;
}

export default function ProductTypeCardComponent({
  image,
  productType,
  isSelected,
  canSelected,
}: Props) {
  return (
    <Card
      className={`aspect-[3/5] min-w-40 cursor-pointer p-1 ${isSelected && "border-4 border-primary"}`}
      shadow="sm"
      isHoverable
    >
      <CardBody className="overflow-hidden">
        <Image
          width={150}
          src={image}
          alt={productType.label}
          className="object-cover pr-1"
        />
      </CardBody>
      <CardFooter className="flex justify-center items-center">
        {canSelected ? (
          <Button
            color={isSelected ? "primary" : "default"}
            variant="flat"
            className="opacity-100"
            isDisabled
          >
            <p className="text-black text-center">{productType.label}</p>
          </Button>
        ) : (
          <Button
            color="primary"
            variant="flat"
            className="opacity-100"
            isDisabled
          >
            <p className="text-black text-center">{productType.label}</p>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

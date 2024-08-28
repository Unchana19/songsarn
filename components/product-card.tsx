import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

interface Props {
  image: string;
  label: string;
}

export default function ProductCard({ image, label }: Props) {
  return (
    <Card
      className="aspect-[3/5] min-w-40 cursor-pointer p-1"
      shadow="sm"
      isHoverable
    >
      <CardBody className="overflow-hidden">
        <Image
          width={150}
          src={image}
          alt={label}
          className="object-cover pr-1"
        />
      </CardBody>
      <CardFooter className="flex justify-center items-center">
        <Button color="primary" variant="flat">
          <p className="text-black">{label}</p>
        </Button>
      </CardFooter>
    </Card>
  );
}

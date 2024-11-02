import { Category } from "@/interfaces/category.interface";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import ImagePlaceholder from "./image-placeholder";

interface Props {
  category: Category;
  isSelected?: boolean;
  canSelected?: boolean;
}

export default function CategoryCard({
  category,
  isSelected,
  canSelected,
}: Props) {
  return (
    <Card
      className={`h-full w-60 cursor-pointer p-1 ${isSelected && "border-2 border-primary"}`}
      shadow="none"
      isHoverable
    >
      <CardBody className="overflow-hidden">
        <div className="flex items-center justify-center h-full mt-5">
          {category.img ? (
            <Image
              src={category.img}
              alt={category.name}
              height={200}
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder
              name={category.name}
              classNames="w-full h-[200px]"
            />
          )}
        </div>
      </CardBody>
      <CardFooter className="flex justify-center items-center">
        {canSelected ? (
          <Button
            color={isSelected ? "primary" : "default"}
            variant="flat"
            className="opacity-100"
            isDisabled
          >
            <p className="text-black text-center text-wrap">{category.name}</p>
          </Button>
        ) : (
          <div className="my-4">
            <p className="text-primary text-lg text-center">{category.name}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

import { Category } from "@/interfaces/category.interface";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { RiDeleteBin6Line } from "react-icons/ri";

interface Props {
  category: Category;
  onRemove: () => void;
}

export default function ComponentCategoryCard({ category, onRemove }: Props) {
  return (
    <Card shadow="none" className="w-full p-4 mb-3 border-primary border-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {category.img && (
            <Image
              src={category.img}
              alt={category.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
          )}
          <span className="font-medium">{category.name}</span>
        </div>
        <Button
          isIconOnly
          color="primary"
          variant="light"
          onClick={onRemove}
          className="ml-2"
        >
          <RiDeleteBin6Line size={20} />
        </Button>
      </div>
    </Card>
  );
}

import { Category } from "@/interfaces/category.interface";
import { Component } from "@/interfaces/component.interface";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { RiImageAddFill, RiImageEditFill } from "react-icons/ri";

interface Props {
  label: string;
  category?: Category | null;
  component: Component | null;
  handleSave: () => void;
  handleDiscard: () => void;
}

export default function EditComponent({
  label,
  category,
  component,
  handleSave,
  handleDiscard,
}: Props) {
  return (
    <div>
      <div>
        <h3>Edit</h3>
      </div>
      <div className="flex mt-5 flex-col md:flex-row gap-10">
        <Card
          className="flex items-center justify-center border-primary border-1 rounded-xl w-1/3 p-5 cursor-pointer"
          isHoverable
        >
          {component?.img ? (
            <div>
              <Image
                src={component?.img}
                alt={component?.name}
                height={200}
                className="object-cover"
              />
              <div className="absolute bottom-3 right-5">
                <RiImageEditFill size={25} color="#D4AF37" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-primary">
              <RiImageAddFill size={30} />
              <p>Upload image</p>
            </div>
          )}
        </Card>
        <div className="flex flex-col gap-5 items-center w-1/3">
          <div className="flex flex-col gap-3 w-full">
            <p>{label} category</p>
            <Input
              variant="bordered"
              color="primary"
              fullWidth
              placeholder={`Enter ${label === "Product" ? "product" : "component"} category`}
              radius="full"
              size="lg"
              value={category?.name}
            />
          </div>
          <div className="flex flex-col w-1/2 gap-2 mt-10">
            <Button
              onClick={handleSave}
              color="primary"
              radius="full"
              fullWidth
              size="lg"
            >
              <p className="text-white font-bold">Save</p>
            </Button>
            <Button onClick={handleDiscard} variant="light">
              <p className="text-danger">Discard</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

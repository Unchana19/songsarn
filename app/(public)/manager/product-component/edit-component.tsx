import { Category } from "@/interfaces/category.interface";
import { Component } from "@/interfaces/component.interface";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { RiImageAddFill, RiImageEditFill } from "react-icons/ri";

interface Props {
  category?: Category | null;
  component: Component | null;
  handleSave: () => void;
  handleDiscard: () => void;
}

export default function EditComponent({
  category,
  component,
  handleSave,
  handleDiscard,
}: Props) {
  return (
    <div>
      <div>
        <h3 className="text-xl font-bold">
          {component ? "Edit" : "New Component"}
        </h3>
      </div>
      <div className="flex mt-5 flex-col md:flex-row gap-20">
        <div className="w-4/12">
          <Card
            className="flex items-center justify-center border-primary border-1 rounded-xl w-full p-5 cursor-pointer"
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
              <div className="flex flex-col items-center text-primary my-20">
                <RiImageAddFill size={30} />
                <p>Upload image</p>
              </div>
            )}
          </Card>
          <div className="flex flex-col gap-5 mt-10">
            <h3 className="text-xl font-bold">Detail</h3>
            <div className="flex flex-col gap-2">
              <p>Component type</p>
              <p className="text-primary pl-2">{category?.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>Component name</p>
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                placeholder="Enter component name"
                radius="full"
                size="lg"
                value={component?.name}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>Price</p>
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                placeholder="Enter component price"
                radius="full"
                size="lg"
                value={component?.price.toString()}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-5/12">
          <h3 className="text-xl font-bold">Material</h3>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-2">
              <p>{"สี (ml.)"}</p>
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                radius="full"
                size="lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>{"น้ำมันรองพื้น (ml.)"}</p>
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                radius="full"
                size="lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>{"น้ำมันทับหน้า (ml.)"}</p>
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                radius="full"
                size="lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>{"ปูน (kg)"}</p>
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                radius="full"
                size="lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>{"ทราย (kg)"}</p>
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                radius="full"
                size="lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>{"ลวด (kg)"}</p>
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                radius="full"
                size="lg"
              />
            </div>
          </div>
          <div className="flex flex-col w-full mt-10 items-center">
            <div className="flex flex-col w-1/2 gap-2">
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
                <p>Discard</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

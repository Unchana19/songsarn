"use client";

import ComponentSelect from "@/components/component-select";
import PatternColorSelect from "@/components/pattern-color-select";
import PrimaryColorSelect from "@/components/primary-color-select";
import { patternColors } from "@/constants/patternColors";
import { primaryColors } from "@/constants/primaryColors";
import { componentAll } from "@/data/component-all";
import { colorPrimary } from "@/data/product-create-struct";
import { productTypes } from "@/data/product-type";
import { Category } from "@/interfaces/category.interface";
import { Product } from "@/interfaces/product.interface";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { SetStateAction, useState } from "react";
import { RiImageAddFill, RiImageEditFill } from "react-icons/ri";

interface Props {
  category?: Category | null;
  product: Product | null;
  handleSave: () => void;
  handleDiscard: () => void;
}

export default function EditProduct({
  category,
  product,
  handleSave,
  handleDiscard,
}: Props) {
  const components = componentAll;

  const baseCategory = productTypes.find((p) => p.name === "ฐานต้น");
  const [selectedBase, setSelectedBase] = useState<string>(components[0].id);
  const [selectedBasePrimaryColor, setSelectedBasePrimaryColor] = useState(
    primaryColors[0]
  );
  const [selectedBasePatternColor, setSelectedBasePatternColor] = useState(
    patternColors[0]
  );

  const bodyCategory = productTypes.find((p) => p.name === "ต้นศาล");
  const [selectedBody, setSelectedBody] = useState<string>(components[5].id);
  const [selectedBodyPrimaryColor, setSelectedBodyPrimaryColor] = useState(
    primaryColors[0]
  );
  const [selectedBodyPatternColor, setSelectedBodyPatternColor] = useState(
    patternColors[0]
  );

  const handleSelectionBaseChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedBase(e.target.value);
  };

  const handleSelectionBodyChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedBody(e.target.value);
  };

  return (
    <div>
      <div>
        <h3 className="text-xl font-bold">
          {product ? "Edit" : "New Product"}
        </h3>
      </div>
      <div className="flex mt-5 flex-col md:flex-row gap-20">
        <div className="md:w-4/12 w-full flex flex-col gap-3">
          <Card
            className="flex items-center justify-center border-primary border-1 rounded-xl w-full p-5 cursor-pointer"
            isHoverable
          >
            {product?.img ? (
              <div>
                <Image
                  src={product?.img}
                  alt={product?.name}
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
          <div className="flex flex-col gap-2 mt-5">
            <p>Product type</p>
            <p className="text-primary pl-2">{category?.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>Product name</p>
            <Input
              variant="bordered"
              color="primary"
              fullWidth
              radius="full"
              size="lg"
              value={product?.name}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Product price</p>
            <Input
              variant="bordered"
              color="primary"
              fullWidth
              radius="full"
              size="lg"
              value={product?.price.toString()}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full md:w-5/12">
          <div className="flex flex-col gap-3 w-full">
            <ComponentSelect
              category={baseCategory!}
              components={components}
              selectedCompoent={selectedBase}
              handleSelectionChange={handleSelectionBaseChange}
              selectedPrimaryColor={selectedBasePrimaryColor}
              setSelectedPrimaryColor={setSelectedBasePrimaryColor}
              selectedPatternColor={selectedBasePatternColor}
              setSelectedPatternColor={setSelectedBasePatternColor}
            />
            <ComponentSelect
              category={bodyCategory!}
              components={components}
              selectedCompoent={selectedBody}
              handleSelectionChange={handleSelectionBodyChange}
              selectedPrimaryColor={selectedBodyPrimaryColor}
              setSelectedPrimaryColor={setSelectedBodyPrimaryColor}
              selectedPatternColor={selectedBodyPatternColor}
              setSelectedPatternColor={setSelectedBodyPatternColor}
            />
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

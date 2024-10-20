"use client";

import ComponentSelect from "@/components/component-select";
import SelectedComponentDetails from "@/components/select-component-detail";
import { Category } from "@/interfaces/category.interface";
import { Color } from "@/interfaces/color.interface";
import { Component } from "@/interfaces/component.interface";
import { Product } from "@/interfaces/product.interface";
import { SelectedComponent } from "@/interfaces/select-component";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { Skeleton } from "@nextui-org/skeleton";
import { useSession } from "next-auth/react";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
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
  const session = useSession();
  const [components, setComponents] = useState<Component[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedComponents, setSelectedComponents] = useState<
    SelectedComponent[]
  >([]);

const [currentComponent, setCurrentComponent] = useState<string>("");
const [currentPrimaryColor, setCurrentPrimaryColor] = useState<Color | null>(
  null
);
const [currentPatternColor, setCurrentPatternColor] = useState<Color | null>(
  null
);

  useEffect(() => {
    fetchComponents();
    fetchColors();
  }, [session]);

  const fetchComponents = async () => {
    try {
      setIsLoading(true);
      const token = session.data?.accessToken;
      const response = await fetch("/api/components", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setComponents(result);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchColors = async () => {
    try {
      setIsLoading(true);
      const token = session.data?.accessToken;
      const response = await fetch("/api/materials/colors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setColors(result);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComponent = (
    component: string,
    primaryColor: Color | null,
    patternColor: Color | null
  ) => {
    const newComponent: SelectedComponent = {
      component,
      primaryColor,
      patternColor,
    };
    setSelectedComponents([...selectedComponents, newComponent]);
    setCurrentComponent("");
    setCurrentPrimaryColor(null);
    setCurrentPatternColor(null);
  };

  const handleRemoveComponent = (index: number) => {
    const updatedComponents = selectedComponents.filter((_, i) => i !== index);
    setSelectedComponents(updatedComponents);
  };

  const renderComponentSelects = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      );
    }

    return (
      <>
        <ComponentSelect
          colors={colors}
          components={components}
          selectedComponent={currentComponent}
          handleSelectionChange={(value) => setCurrentComponent(value)}
          selectedPrimaryColor={currentPrimaryColor}
          setSelectedPrimaryColor={setCurrentPrimaryColor}
          selectedPatternColor={currentPatternColor}
          setSelectedPatternColor={setCurrentPatternColor}
          onAddComponent={handleAddComponent}
        />
        {selectedComponents.map((selectedComp, index) => (
          <SelectedComponentDetails
            key={index}
            selectedComponent={selectedComp}
            componentDetails={components.find(
              (c) => c.id === selectedComp.component
            )}
            onRemove={() => handleRemoveComponent(index)}
          />
        ))}
      </>
    );
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
            {isLoading ? (
              <Skeleton className="rounded-lg">
                <div className="h-48 rounded-lg bg-default-300"></div>
              </Skeleton>
            ) : product?.img ? (
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
            {isLoading ? (
              <Skeleton className="h-6 w-1/2 rounded-full" />
            ) : (
              <p className="text-primary pl-2">{category?.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p>Product name</p>
            {isLoading ? (
              <Skeleton className="h-12 w-full rounded-full" />
            ) : (
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                placeholder="Enter product name"
                radius="full"
                size="lg"
                value={product?.name}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p>Product price</p>
            {isLoading ? (
              <Skeleton className="h-12 w-full rounded-full" />
            ) : (
              <Input
                variant="bordered"
                color="primary"
                fullWidth
                placeholder="Enter product price"
                radius="full"
                size="lg"
                value={product?.price.toString()}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full md:w-6/12">
          <div className="flex flex-col gap-3 w-full">
            {renderComponentSelects()}
          </div>
          <div className="flex flex-col w-full mt-10 items-center">
            <div className="flex flex-col w-1/2 gap-2">
              <Button
                onClick={handleSave}
                color="primary"
                radius="full"
                fullWidth
                size="lg"
                isDisabled={isLoading}
              >
                <p className="text-white">Save</p>
              </Button>
              <Button
                onClick={handleDiscard}
                variant="light"
                isDisabled={isLoading}
              >
                <p>Discard</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

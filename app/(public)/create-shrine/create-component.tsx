"use client";

import ImagePlaceholder from "@/components/image-placeholder";
import { Category } from "@/interfaces/category.interface";
import { Color } from "@/interfaces/color.interface";
import { Component } from "@/interfaces/component.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { Progress } from "@nextui-org/progress";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBasketShopping } from "react-icons/fa6";

interface Props {
  selectedCategory: string;
}

export interface ComponentSelection {
  categoryId: string;
  component: Component | null;
  primaryColor: Color | null;
  patternColor: Color | null;
}

export default function CreateComponentPage({ selectedCategory }: Props) {
  const session = useSession();
  const router = useRouter();
  const [bomCategories, setBomCategories] = useState<Category[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<ComponentSelection[]>([]);

  const fetchBOMCategories = async () => {
    setIsLoading(true);
    try {
      const token = session.data?.accessToken;
      const response = await fetch(
        `/api/categories/bom-categories/${selectedCategory}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setBomCategories(result);
      }
    } catch (error) {
      console.error("Failed to fetch BOM categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.error("Failed to fetch components:", error);
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
      console.error("Failed to fetch colors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBOMCategories();
    fetchComponents();
    fetchColors();
  }, [session]);

  useEffect(() => {
    if (bomCategories.length > 0) {
      setSelections(
        bomCategories.map((category) => ({
          categoryId: category.id,
          component: null,
          primaryColor: null,
          patternColor: null,
        }))
      );
    }
  }, [bomCategories]);

  useEffect(() => {
    const total = selections.reduce((sum, selection) => {
      return sum + (selection.component?.price || 0);
    }, 0);
    setTotalPrice(total);
  }, [selections]);

  const handleComponentSelect = (categoryId: string, component: Component) => {
    setSelections((prev) =>
      prev.map((selection) =>
        selection.categoryId === categoryId
          ? { ...selection, component }
          : selection
      )
    );
  };

  const handleColorSelect = (
    categoryId: string,
    color: Color,
    type: "primary" | "pattern"
  ) => {
    setSelections((prev) =>
      prev.map((selection) =>
        selection.categoryId === categoryId
          ? {
              ...selection,
              [type === "primary" ? "primaryColor" : "patternColor"]: color,
            }
          : selection
      )
    );
  };

  const handleProductSave = async () => {
    try {
      const simplifiedComponents = selections.map((item) => ({
        id: item.component?.id,
        primary_color: item.primaryColor?.id,
        pattern_color: item.patternColor?.id,
      }));
      const data = {
        user_id: session.data?.userId,
        category_id: selectedCategory,
        price: totalPrice,
        quantity,
        components: simplifiedComponents,
      };

      const response = await fetch("/api/products/customize", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.data?.accessToken}` },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        router.push("/cart");
      } else {
      }
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Progress size="sm" isIndeterminate aria-label="Loading..." />
      </div>
    );
  }

  const isValid = selections.every(
    (selection) =>
      selection.component && selection.primaryColor && selection.patternColor
  );

  function decreateQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function increateQuantity() {
    setQuantity(quantity + 1);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-8 pb-32">
        {" "}
        {/* เพิ่ม padding-bottom สำหรับ fixed button */}
        {/* Categories */}
        {bomCategories.map((category) => {
          const categoryComponents = components.filter(
            (c) => c.category_id === category.id
          );
          const selection = selections.find(
            (s) => s.categoryId === category.id
          );

          return (
            <div key={category.id} className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  {selection?.component && (
                    <Chip
                      variant="flat"
                      color="primary"
                      classNames={{
                        base: "bg-primary-50",
                        content: "text-primary-600 font-medium",
                      }}
                    >
                      Selected
                    </Chip>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryComponents.map((component) => (
                  <Card
                    key={component.id}
                    isPressable
                    className={`border-2 transition-all duration-200 hover:scale-[1.02] ${
                      selection?.component?.id === component.id
                        ? "border-primary shadow-lg shadow-primary/20"
                        : "border-transparent hover:border-primary/50"
                    }`}
                    onPress={() =>
                      handleComponentSelect(category.id, component)
                    }
                  >
                    <CardBody className="p-0 aspect-square flex justify-center">
                      {component.img ? (
                        <Image
                          src={component.img}
                          alt={component.name}
                          classNames={{
                            wrapper: "w-full h-full",
                            img: "object-cover w-full h-full",
                          }}
                        />
                      ) : (
                        <ImagePlaceholder
                          name={component.name}
                          classNames="h-full bg-default-100"
                        />
                      )}
                    </CardBody>
                    <CardFooter className="flex flex-col items-start p-4">
                      <p className="font-medium">{component.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-primary font-semibold">
                          {formatNumberWithComma(component.price)}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {selection?.component && (
                <div className="space-y-6 p-6 bg-default-50 rounded-xl border border-default-200">
                  {/* Color Selection */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <p className="font-medium">Primary Color</p>
                      <div className="flex gap-3 flex-wrap">
                        {colors.map((color) => (
                          <button
                            key={color.id}
                            className={`w-10 h-10 rounded-xl transition-transform hover:scale-110 ${
                              selection.primaryColor?.id === color.id
                                ? "ring-2 ring-primary ring-offset-2"
                                : ""
                            }`}
                            style={{ backgroundColor: color.color }}
                            onClick={() =>
                              handleColorSelect(category.id, color, "primary")
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="font-medium">Pattern Color</p>
                      <div className="flex gap-3 flex-wrap">
                        {colors.map((color) => (
                          <button
                            key={color.id}
                            className={`w-10 h-10 rounded-xl transition-transform hover:scale-110 ${
                              selection.patternColor?.id === color.id
                                ? "ring-2 ring-primary ring-offset-2"
                                : ""
                            }`}
                            style={{ backgroundColor: color.color }}
                            onClick={() =>
                              handleColorSelect(category.id, color, "pattern")
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Divider className="my-8" />
            </div>
          );
        })}
        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t z-100">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">
                    {formatNumberWithComma(totalPrice * quantity)}
                  </span>
                </div>
                <p className="text-sm text-default-500">Total Price</p>
              </div>

              <div className="border-primary border-1.5 rounded-full p-1 w-36">
                <ButtonGroup className="flex justify-between">
                  <Button
                    onClick={decreateQuantity}
                    isIconOnly
                    radius="full"
                    variant="light"
                    className="text-2xl"
                  >
                    -
                  </Button>
                  <div>{quantity}</div>
                  <Button
                    onClick={increateQuantity}
                    isIconOnly
                    radius="full"
                    variant="light"
                    className="text-xl"
                  >
                    +
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <Button
              onClick={handleProductSave}
              color="primary"
              size="lg"
              className="font-medium px-8"
              radius="full"
              isDisabled={!isValid}
            >
              Add to cart
              <FaBasketShopping size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

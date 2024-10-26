"use client";

import ComponentSelect from "@/components/component-select";
import { Category } from "@/interfaces/category.interface";
import { Color } from "@/interfaces/color.interface";
import { Component } from "@/interfaces/component.interface";
import { Product } from "@/interfaces/product.interface";
import { SelectedComponent } from "@/interfaces/select-component";
import {
  CreateProductSchema,
  createProductSchema,
} from "@/lib/schemas/createProductSchema";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { Input, Textarea } from "@nextui-org/input";
import { Skeleton } from "@nextui-org/skeleton";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RiImageAddFill, RiImageEditFill } from "react-icons/ri";

interface Props {
  category: Category;
  product: Product | null;
  handleSave: (
    data: CreateProductSchema,
    selectedComponents: SelectedComponent[],
    file: File | null
  ) => void;
  handleDiscard: () => void;
}

export default function EditProduct({
  category,
  product,
  handleSave,
  handleDiscard,
}: Props) {
  const session = useSession();
  const [bomCategories, setBomCategories] = useState<Category[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComponents, setSelectedComponents] = useState<
    SelectedComponent[]
  >([]);

  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.img || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setselectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    fetchBOMCategories();
    fetchComponents();
    fetchColors();
  }, [session]);

  useEffect(() => {
    const initialComponents = bomCategories.map((category) => ({
      bomCategoryId: category.id,
      component: "",
      primary_color: null,
      pattern_color: null,
    }));
    setSelectedComponents(initialComponents);
  }, [bomCategories]);

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

  const fetchBOMCategories = async () => {
    if (!category) return;

    setIsLoading(true);
    try {
      const token = session.data?.accessToken;
      const response = await fetch(
        `/api/categories/bom-categories/${category.id}`,
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    mode: "onTouched",
    defaultValues: product
      ? {
          category: category.id,
          name: product.name,
          price: "0",
        }
      : {
          category: category.id,
          price: "0",
        },
  });

  const calculateTotalPrice = () => {
    if (selectedComponents.length === 0) return 0;

    return selectedComponents.reduce((total, selection) => {
      if (!selection.component) return total;

      const component = components.find((c) => c.id === selection.component);
      return total + (component?.price || 0);
    }, 0);
  };

  const isFormValid = () => {
    if (bomCategories.length === 0 || isLoading) return false;

    return selectedComponents.every((selection) => {
      return (
        selection.component !== "" &&
        selection.primary_color !== null &&
        selection.pattern_color !== null
      );
    });
  };

  const handleComponentChange = (
    categoryId: string,
    componentId: string,
    primary_color: Color | null,
    pattern_color: Color | null
  ) => {
    setSelectedComponents((prev) => {
      return prev.map((item) => {
        if (item.bomCategoryId === categoryId) {
          return {
            ...item,
            component: componentId,
            primary_color,
            pattern_color,
          };
        }
        return item;
      });
    });
  };

  const onSubmit = async (data: CreateProductSchema) => {
    setValue("price", calculateTotalPrice().toString());
    await handleSave(data, selectedComponents, selectedFile);
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
        <div>
          <h3 className="text-lg font-bold">BOM product</h3>
        </div>
        {bomCategories.map((bomCategory) => {
          const filterComponents = components.filter(
            (c) => c.category_id === bomCategory.id
          );
          const selectedComponent = selectedComponents.find(
            (sc) => sc.bomCategoryId === bomCategory.id
          );

          return (
            <div key={bomCategory.id} className="mb-4">
              <ComponentSelect
                category={bomCategory}
                colors={colors}
                components={filterComponents}
                selectedComponent={selectedComponent?.component || ""}
                handleSelectionChange={(value) =>
                  handleComponentChange(
                    bomCategory.id,
                    value,
                    selectedComponent?.primary_color || null,
                    selectedComponent?.pattern_color || null
                  )
                }
                selectedPrimaryColor={selectedComponent?.primary_color || null}
                setSelectedPrimaryColor={(color) =>
                  handleComponentChange(
                    bomCategory.id,
                    selectedComponent?.component || "",
                    color,
                    selectedComponent?.pattern_color || null
                  )
                }
                selectedPatternColor={selectedComponent?.pattern_color || null}
                setSelectedPatternColor={(color) =>
                  handleComponentChange(
                    bomCategory.id,
                    selectedComponent?.component || "",
                    selectedComponent?.primary_color || null,
                    color
                  )
                }
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-xl font-bold">
          {product ? "Edit" : "New Product"}
        </h3>
      </div>
      <div className="flex mt-5 flex-col md:flex-row gap-20">
        <div className="md:w-4/12 w-full flex flex-col gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <div onClick={triggerFileInput} className="">
            <Card
              className="flex items-center justify-center border-primary border-1 rounded-xl w-full p-5 cursor-pointer"
              isHoverable
            >
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt={product?.name || "Product image"}
                    height={200}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-primary my-20">
                  <RiImageAddFill size={30} />
                  <p>Upload image</p>
                </div>
              )}
              {imagePreview !== null ? (
                <div className="absolute z-10 bottom-3 right-5">
                  <RiImageEditFill size={25} color="#D4AF37" />
                </div>
              ) : null}
            </Card>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="mt-3">
            <h3 className="text-lg font-bold">Detail</h3>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <p>Product categoy</p>
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
                {...register("name")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message as string}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p>Product detail</p>
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-2xl" />
            ) : (
              <Textarea
                variant="bordered"
                color="primary"
                fullWidth
                placeholder="Enter product detail..."
                radius="lg"
                minRows={4}
                maxRows={8}
                classNames={{
                  input: "resize-none py-3 px-4 text-md",
                  inputWrapper: "min-h-[120px] shadow-sm",
                }}
                {...register("detail")}
                isInvalid={!!errors.detail}
                errorMessage={errors.detail?.message as string}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p>Total price</p>
            {isLoading ? (
              <Skeleton className="h-12 w-full rounded-full" />
            ) : (
              <Card shadow="none" className="w-full">
                <div className="p-4">
                  <div className="flex flex-col gap-1">
                    {selectedComponents.map((selection) => {
                      if (!selection.component) return null;
                      const component = components.find(
                        (c) => c.id === selection.component
                      );
                      if (!component) return null;

                      return (
                        <div
                          key={selection.bomCategoryId}
                          className="flex justify-between text-small text-default-600"
                        >
                          <span>{component.name}</span>
                          <span>{formatNumberWithComma(component.price)}</span>
                        </div>
                      );
                    })}
                    <Divider className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-primary text-lg">
                        {formatNumberWithComma(calculateTotalPrice())}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
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
                type="submit"
                color="primary"
                radius="full"
                fullWidth
                size="lg"
                isLoading={isSubmitting}
                isDisabled={!isValid || !isFormValid()}
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
    </form>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Category } from "@/interfaces/category.interface";
import {
  createCategorySchema,
  CreateCategorySchema,
} from "@/lib/schemas/createCategoySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import {
  RiImageAddFill,
  RiImageEditFill,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { useSession } from "next-auth/react";
import { Select, SelectItem } from "@nextui-org/select";
import { Card } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";

interface Props {
  label: string;
  category?: Category | null;
  handleSave: (data: CreateCategorySchema, file: File | null) => void;
  handleDiscard: () => void;
}

const LoadingCard = () => {
  return (
    <Card className="w-full h-60 p-5">
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="w-3/4 h-4 rounded-lg" />
      </div>
    </Card>
  );
};

const ComponentCategoryCard = ({
  category,
  onRemove,
}: {
  category: Category;
  onRemove: () => void;
}) => {
  return (
    <Card className="w-full p-4 mb-3">
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
          color="danger"
          variant="light"
          onClick={onRemove}
          className="ml-2"
        >
          <RiDeleteBin6Line size={20} />
        </Button>
      </div>
    </Card>
  );
};

export default function EditCategory({
  label,
  category,
  handleSave,
  handleDiscard,
}: Props) {
  const session = useSession();
  const [componentCategories, setComponentCategories] = useState<Category[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComponentCategory, setSelectedComponentCategory] =
    useState<Category | null>();
  const [selectedComponentCategories, setSelectedComponentCategories] =
    useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (label === "product") {
      fetchComponentCategories();
    }
    setValue("type", label.toLowerCase());
  }, [label, session]);

  const fetchComponentCategories = async () => {
    try {
      setIsLoading(true);
      const token = session.data?.accessToken;
      const response = await fetch("/api/categories/component-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setComponentCategories(result);
      }
    } catch (error) {
      console.error("Error fetching component categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableComponentCategories = () => {
    return componentCategories.filter(
      (category) =>
        !selectedComponentCategories.some(
          (selected) => selected.id === category.id
        )
    );
  };

  const handleSelectionChange = (categoryId: string) => {
    const selected = componentCategories.find((c) => c.id === categoryId);
    setSelectedComponentCategory(selected || null);
  };

  const handleAddCategory = () => {
    if (
      selectedComponentCategory &&
      !selectedComponentCategories.some(
        (c) => c.id === selectedComponentCategory.id
      )
    ) {
      setSelectedComponentCategories([
        ...selectedComponentCategories,
        selectedComponentCategory,
      ]);
      setSelectedComponentCategory(null);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedComponentCategories(
      selectedComponentCategories.filter((c) => c.id !== categoryId)
    );
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: CreateCategorySchema) => {
    // Include selected categories in the form data
    const formData = {
      ...data,
      componentCategories: selectedComponentCategories.map((c) => c.id),
    };
    await handleSave(formData, selectedFile);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="w-48 h-8 rounded-lg mb-5" />
        <div className="flex mt-5 flex-col md:flex-row gap-10">
          <div className="w-1/3">
            <LoadingCard />
          </div>
          <div className="flex flex-col gap-5 items-center w-1/3">
            <div className="w-full">
              <Skeleton className="w-32 h-4 rounded-lg mb-3" />
              <Skeleton className="w-full h-12 rounded-full" />
              {label === "product" && (
                <div className="mt-5">
                  <Skeleton className="w-32 h-4 rounded-lg mb-3" />
                  <Skeleton className="w-full h-12 rounded-full" />
                </div>
              )}
            </div>
            <div className="flex flex-col w-1/2 gap-2 mt-10">
              <Skeleton className="w-full h-12 rounded-full" />
              <Skeleton className="w-full h-12 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3>
          {category
            ? "Edit"
            : `New ${label === "product" ? "product" : "component"} category`}
        </h3>
      </div>
      <div className="flex mt-5 flex-col md:flex-row gap-10">
        <div
          onClick={handleImageClick}
          className="flex justify-center w-1/3 cursor-pointer"
        >
          <Card
            className="flex justify-center border-primary border-1 rounded-xl w-full h-60 p-5"
            isHoverable
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {previewUrl || category?.img ? (
              <div className="relative">
                <Image
                  src={previewUrl || category?.img}
                  alt={category?.name || "Preview"}
                  height={200}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-primary">
                <RiImageAddFill size={30} />
                <p>Upload image</p>
              </div>
            )}
            {previewUrl || category?.img ? (
              <div className="absolute z-10 bottom-3 right-5">
                <RiImageEditFill size={30} color="#D4AF37" />
              </div>
            ) : null}
          </Card>
        </div>
        <div className="flex flex-col gap-5 items-center w-2/3">
          <div className="flex flex-col gap-3 w-full">
            <p>{label} category</p>
            <Input
              variant="bordered"
              color="primary"
              fullWidth
              placeholder={`Enter ${label === "product" ? "product" : "component"} category`}
              radius="full"
              size="lg"
              defaultValue={category?.name}
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message as string}
            />

            {label === "product" && (
              <div className="mt-2">
                <div>
                  <p>BOM Product</p>
                </div>
                <div className="flex gap-2">
                  <Select
                    size="lg"
                    radius="full"
                    placeholder="Select component categories"
                    labelPlacement="outside"
                    variant="bordered"
                    color="primary"
                    className="flex-1"
                    selectedKeys={
                      selectedComponentCategory
                        ? [selectedComponentCategory.id]
                        : []
                    }
                    onChange={(e) => handleSelectionChange(e.target.value)}
                    isLoading={isLoading}
                  >
                    {getAvailableComponentCategories().map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Button
                    color="primary"
                    radius="full"
                    onClick={handleAddCategory}
                    isDisabled={!selectedComponentCategory}
                  >
                    Select
                  </Button>
                </div>

                <div className="mt-4">
                  <p className="mb-2">Selected Components:</p>
                  <div className="max-h-60 overflow-y-auto">
                    {selectedComponentCategories.map((category) => (
                      <ComponentCategoryCard
                        key={category.id}
                        category={category}
                        onRemove={() => handleRemoveCategory(category.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col w-1/3 gap-2 mt-10">
            <Button
              type="submit"
              color="primary"
              radius="full"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              isDisabled={!isValid}
            >
              <p className="text-white font-bold">Save</p>
            </Button>
            <Button onClick={handleDiscard} variant="light">
              <p>Discard</p>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

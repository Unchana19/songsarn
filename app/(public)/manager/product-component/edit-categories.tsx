import type React from "react";
import { useState, useRef, useEffect } from "react";
import type { Category } from "@/interfaces/category.interface";
import {
  createCategorySchema,
  type CreateCategorySchema,
} from "@/lib/schemas/createCategoySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { RiImageAddFill, RiImageEditFill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { Select, SelectItem } from "@heroui/select";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import ComponentCategoryCard from "@/components/component-category-card";
import EmptyComponents from "@/components/empty-components";
import {
  useFetchBomCategoriesQuery,
  useFetchComponentCategoriesQuery,
} from "@/store";

interface Props {
  label: string;
  category?: Category;
  handleSave: (
    data: CreateCategorySchema,
    file: File | null,
    componentCategories: string[]
  ) => void;
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

export default function EditCategory({
  label,
  category,
  handleSave,
  handleDiscard,
}: Props) {
  const session = useSession();
  const { data: componentCategories, isLoading: isLoadingComponentCategories } =
    useFetchComponentCategoriesQuery(session.data?.accessToken || "");

  const {
    data: bomCategories = [],
    isLoading: isLoadingBomCategories,
    isSuccess: isSuccessBomCategories,
  } = useFetchBomCategoriesQuery({
    categoryId: category?.id || "",
    accessToken: session.data?.accessToken || "",
  });

  const [selectedComponentCategory, setSelectedComponentCategory] =
    useState<Category | null>();
  const [selectedComponentCategories, setSelectedComponentCategories] =
    useState<Category[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (label === "product") {
      if (category) {
        if (!isLoadingBomCategories || isSuccessBomCategories) {
          setSelectedComponentCategories(bomCategories);
        }
      } else {
        setSelectedComponentCategories([]);
      }
    }
    setValue("type", label.toLowerCase());
  }, [
    label,
    category,
    bomCategories,
    isLoadingBomCategories,
    isSuccessBomCategories,
  ]);

  const getAvailableComponentCategories = () => {
    return componentCategories.filter(
      (category: Category) =>
        !selectedComponentCategories.some(
          (selected) => selected.id === category.id
        )
    );
  };

  const handleSelectionChange = (categoryId: string) => {
    const selected = componentCategories.find(
      (c: Category) => c.id === categoryId
    );
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
    const componentCategories = selectedComponentCategories.map((c) => c.id);
    await handleSave(data, selectedFile, componentCategories);
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

  if (
    isLoadingComponentCategories ||
    isLoadingBomCategories ||
    !isSuccessBomCategories
  ) {
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
        <h3 className="font-bold text-lg">
          {category
            ? `Edit ${label === "product" ? "product" : "component"} category`
            : `New ${label === "product" ? "product" : "component"} category`}
        </h3>
      </div>
      <div className="flex mt-5 flex-col md:flex-row gap-10">
        <button
          type="button"
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
              <div className="flex items-center justify-center">
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
        </button>
        <div className="flex flex-col gap-5 items-center w-2/3">
          <div className="flex flex-col gap-3 w-full">
            <p>Name</p>
            <Input
              variant="bordered"
              color="primary"
              fullWidth
              placeholder="Enter name category"
              radius="full"
              size="lg"
              defaultValue={category?.name}
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message as string}
            />

            {label === "product" && (
              <div className="mt-2">
                <div className="my-2">
                  <p>BOM product</p>
                </div>
                <div className="flex flex-col gap-4">
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
                    isLoading={
                      isLoadingComponentCategories || isLoadingBomCategories
                    }
                  >
                    {getAvailableComponentCategories().map(
                      (category: Category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      )
                    )}
                  </Select>
                  <Button
                    color="primary"
                    className="text-white"
                    radius="full"
                    onClick={handleAddCategory}
                    isDisabled={!selectedComponentCategory}
                  >
                    Select
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="max-h-60">
                    {selectedComponentCategories.length > 0 ? (
                      selectedComponentCategories.map((category) => (
                        <ComponentCategoryCard
                          key={category.id}
                          category={category}
                          onRemove={() => handleRemoveCategory(category.id)}
                        />
                      ))
                    ) : (
                      <EmptyComponents
                        title="No BOM product selected"
                        subTitle="Select BOM product categories from the dropdown above"
                      />
                    )}
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
              isDisabled={
                !isValid ||
                (label === "product" &&
                  selectedComponentCategories.length === 0)
              }
            >
              <p className="text-white">Save</p>
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

import React, { useState, useRef } from "react";
import { Category } from "@/interfaces/category.interface";
import {
  createCategorySchema,
  CreateCategorySchema,
} from "@/lib/schemas/createCategoySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { RiImageAddFill, RiImageEditFill } from "react-icons/ri";

interface Props {
  label: string;
  category?: Category | null;
  handleSave: (data: CreateCategorySchema, file: File | null) => void;
  handleDiscard: () => void;
}

export default function EditCategory({
  label,
  category,
  handleSave,
  handleDiscard,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    mode: "onTouched",
  });

  setValue("type", label.toLowerCase());
  
  const onSubmit = async (data: CreateCategorySchema) => {
    await handleSave(data, selectedFile);
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
          className="flex items-center justify-center w-1/3 cursor-pointer"
        >
          <Card
            className="flex items-center justify-center border-primary border-1 rounded-xl w-full h-full p-5"
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
        <div className="flex flex-col gap-5 items-center w-1/3">
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
          </div>
          <div className="flex flex-col w-1/2 gap-2 mt-10">
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

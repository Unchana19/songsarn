import { Category } from "@/interfaces/category.interface";
import { Component } from "@/interfaces/component.interface";
import { Material } from "@/interfaces/material.interface";
import {
  CreateComponentSchema,
  createComponentSchema,
} from "@/lib/schemas/createComponentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Skeleton } from "@nextui-org/skeleton";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  RiAddLine,
  RiDeleteBin5Line,
  RiImageAddFill,
  RiImageEditFill,
} from "react-icons/ri";

interface Props {
  category: Category;
  component: Component | null;
  handleSave: (
    data: CreateComponentSchema,
    materials: { material: Material; quantity: string }[],
    file: File | null
  ) => void;
  handleDiscard: () => void;
}

export default function EditComponent({
  category,
  component,
  handleSave,
  handleDiscard,
}: Props) {
  const session = useSession();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateComponentSchema>({
    resolver: zodResolver(createComponentSchema),
    mode: "onTouched",
  });

  setValue("category", category?.id);

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [quantity, setQuantity] = useState<string>("");

  const [selectedMaterials, setSelectedMaterials] = useState<
    Array<{ material: Material; quantity: string }>
  >([]);

  const getAvailableMaterials = () => {
    return materials.filter(
      (material) =>
        !selectedMaterials.some(
          (selected) => selected.material.id === material.id
        )
    );
  };

  const handleAddMaterial = () => {
    if (selectedMaterial && quantity) {
      setSelectedMaterials([
        ...selectedMaterials,
        { material: selectedMaterial, quantity },
      ]);
      setSelectedMaterial(null);
      setQuantity("");
    }
  };

  const handleRemoveMaterial = (index: number) => {
    const newMaterials = [...selectedMaterials];
    newMaterials.splice(index, 1);
    setSelectedMaterials(newMaterials);
  };

  const handleSelectionChange = (materialId: string) => {
    const selected = materials.find((m) => m.id === materialId);
    setSelectedMaterial(selected || null);
    setQuantity("");
  };

  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    component?.img || null
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
    fetchMaterials();
  }, [session]);

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const token = session.data?.accessToken;
      const response = await fetch("/api/materials", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setMaterials(result);
      }
    } catch (error) {
      console.error("Failed to fetch materials", error);
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateComponentSchema) => {
    await handleSave(data, selectedMaterials, selectedFile);
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="flex mt-5 flex-col md:flex-row gap-20">
          <div className="w-4/12">
            <Skeleton className="rounded-xl">
              <div className="h-60 rounded-xl bg-default-300"></div>
            </Skeleton>
            <div className="flex flex-col gap-5 mt-10">
              <Skeleton className="w-3/4 rounded-lg">
                <div className="h-3 w-3/4 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-full rounded-full">
                <div className="h-10 w-full rounded-full bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-full rounded-full">
                <div className="h-10 w-full rounded-full bg-default-200"></div>
              </Skeleton>
            </div>
          </div>
          <div className="flex flex-col gap-5 w-5/12">
            <Skeleton className="w-3/4 rounded-lg">
              <div className="h-3 w-3/4 rounded-lg bg-default-200"></div>
            </Skeleton>
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="w-full rounded-full">
                <div className="h-10 w-full rounded-full bg-default-200"></div>
              </Skeleton>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-xl font-bold">
          {component ? "Edit" : "New Component"}
        </h3>
      </div>
      <div className="flex mt-5 flex-col md:flex-row gap-20">
        <div className="w-4/12">
          <div onClick={triggerFileInput} className="">
            <Card
              className="flex items-center justify-center border-primary border-1 rounded-xl w-full p-5 cursor-pointer"
              isHoverable
            >
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt={component?.name || "Component image"}
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
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
                {...register("name")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message as string}
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
                {...register("price")}
                isInvalid={!!errors.price}
                errorMessage={errors.price?.message as string}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-6/12">
          <h3 className="text-xl font-bold">Material</h3>
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-5">
              <Select
                size="lg"
                radius="full"
                label="Select Material"
                labelPlacement="outside"
                variant="bordered"
                color="primary"
                selectedKeys={selectedMaterial ? [selectedMaterial.id] : []}
                onChange={(e) => handleSelectionChange(e.target.value)}
              >
                {getAvailableMaterials().map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name}
                  </SelectItem>
                ))}
              </Select>
              {selectedMaterial && (
                <div className="flex items-center gap-2">
                  <Input
                    variant="bordered"
                    color="primary"
                    fullWidth
                    radius="full"
                    labelPlacement="outside"
                    size="lg"
                    label="Quantity"
                    placeholder={`Enter ${selectedMaterial.name} quantity`}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    endContent={
                      <div className="text-primary">
                        {selectedMaterial.unit}
                      </div>
                    }
                  />
                </div>
              )}
              <Button
                size="lg"
                color="primary"
                radius="full"
                className="text-white"
                onClick={handleAddMaterial}
                isDisabled={quantity == ""}
              >
                <RiAddLine size={25} />
                <p>Add material</p>
              </Button>
            </div>

            {selectedMaterials.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-bold">Selected Materials</h4>
                <Table
                  aria-label="Selected materials table"
                  classNames={{
                    base: "mt-4 rounded-xl",
                    th: "bg-primary-100 text-md py-3",
                    td: "text-md py-3",
                  }}
                >
                  <TableHeader>
                    <TableColumn className="font-bold">Material</TableColumn>
                    <TableColumn className="font-bold">Quantity</TableColumn>
                    <TableColumn className="font-bold">Unit</TableColumn>
                    <TableColumn className="font-bold">Remove</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {selectedMaterials.map((item, index) => (
                      <TableRow key={index} className="hover:bg-amber-50">
                        <TableCell>{item.material.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.material.unit}</TableCell>
                        <TableCell>
                          <Button
                            isIconOnly
                            color="primary"
                            variant="light"
                            onClick={() => handleRemoveMaterial(index)}
                          >
                            <RiDeleteBin5Line size={20} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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
                isDisabled={!isValid || selectedMaterials.length == 0}
              >
                <p className="text-white">Save</p>
              </Button>
              <Button onClick={handleDiscard} variant="light">
                <p>Discard</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

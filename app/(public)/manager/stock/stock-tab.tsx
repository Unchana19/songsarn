"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import TabsSelect from "@/components/tabs-select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Key, useTransition } from "react";
import AllMeterial from "./all-meterial";
import { Button } from "@nextui-org/button";
import { FaPlus } from "react-icons/fa";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { useForm } from "react-hook-form";
import {
  createMaterialSchema,
  CreateMaterialSchema,
} from "@/lib/schemas/createMaterialSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/skeleton";
import { Material } from "@/interfaces/material.interface";
import PopupModal from "@/components/popup-modal";
import AllRequisition from "./all-requisition";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { getContrastColor } from "@/utils/get-contrast-color";
import { Checkbox } from "@nextui-org/checkbox";
import { cn } from "@nextui-org/theme";

export default function StockTab() {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const editModal = useDisclosure();
  const popupModal = useDisclosure();

  const [isColor, setIsColor] = useState(false);
  const [colorCode, setColorCode] = useState("#000000");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState("");

  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [material, setMaterial] = useState<Material | null>();

  const [requisitions, setRequisitions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateMaterialSchema>({
    resolver: zodResolver(createMaterialSchema),
    mode: "onTouched",
  });

  const getStepContent = (label: string) => {
    switch (label) {
      case "All material":
        return isLoading ? (
          <SkeletonLoading />
        ) : (
          <AllMeterial
            materials={materials}
            handleEdit={handleEdit}
            fetchRequisition={fetchRequisitions}
          />
        );
      case "All requisition":
        return isLoading ? (
          <SkeletonLoading />
        ) : (
          <AllRequisition
            requisitions={requisitions}
            fetchRequisition={fetchRequisitions}
          />
        );
      default:
        return "unknown label";
    }
  };

  const tabs = [
    { id: "material", label: "All material" },
    { id: "requisition", label: "All requisition" },
  ];

  const handleTabChange = (key: Key) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const fetchMaterials = async () => {
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
      setError("Failed to fetch materials");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequisitions = async () => {
    try {
      const token = session.data?.accessToken;
      const response = await fetch("/api/requisitions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setRequisitions(result);
      }
    } catch (error) {
      setError("Failed to fetch requisitions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchRequisitions();
  }, [session]);

  const handleColorChange = (color: SetStateAction<string>) => {
    setColorCode(color);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node)
    ) {
      setIsColorPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: CreateMaterialSchema) => {
    try {
      let response;
      let submissionData;

      if (isColor) {
        submissionData = { ...data, color: colorCode };
      } else {
        submissionData = { ...data };
      }

      if (material) {
        const dataWithId = { id: material.id, ...submissionData };
        response = await fetch("/api/materials", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.accessToken}`,
          },
          body: JSON.stringify(dataWithId),
        });
      } else {
        response = await fetch("/api/materials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.accessToken}`,
          },
          body: JSON.stringify(submissionData),
        });
      }

      const result = await response.json();
      if (response.ok) {
        setError("");
        editModal.onOpenChange();
        fetchMaterials();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/materials?id=${material?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setError("");
        setMaterial(null);
        popupModal.onOpenChange();
        editModal.onOpenChange();
        fetchMaterials();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const handleEdit = (material: Material) => {
    setMaterial(material);
    setValue("name", material.name);
    setValue("unit", material.unit);
    setValue("quantity", material.quantity.toString());
    setValue("threshold", material.threshold.toString());
    editModal.onOpen();
  };

  return (
    <div className="mb-40 w-full">
      <h3 className="font-bold text-xl mb-5">Stock</h3>
      <div className="flex items-center gap-10 w-full">
        <TabsSelect
          size="lg"
          tabs={tabs}
          handleTabChange={handleTabChange}
          isPending={isPending}
          variant="bordered"
        />

        {searchParams.get("type") === "material" ? (
          <Button
            onClick={() => {
              setMaterial(null);
              setValue("name", "");
              setValue("unit", "");
              setValue("quantity", "");
              setValue("threshold", "");
              editModal.onOpen();
            }}
            color="primary"
            radius="full"
            className="text-white"
          >
            <FaPlus />
            <p>Add material</p>
          </Button>
        ) : null}
      </div>

      <div>
        {tabs.map((tab) => {
          const isSelected = searchParams.get("type") === tab.id;
          return isSelected ? (
            <div className="mt-5">
              {isLoading ? <SkeletonLoading /> : getStepContent(tab.label)}
            </div>
          ) : null;
        })}
      </div>

      <Modal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="xl"
        className="flex justify-center items-center px-3 py-5"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-xl">{material ? "Edit" : "New material"}</p>
              </ModalHeader>
              <ModalBody className="flex w-full">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-5 w-full "
                >
                  <Input
                    type="text"
                    label="Material name"
                    placeholder="Enter material name"
                    labelPlacement="outside"
                    variant="bordered"
                    color="primary"
                    radius="full"
                    size="lg"
                    {...register("name")}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message as string}
                  />
                  <Input
                    type="text"
                    label="Unit"
                    placeholder="Enter unit"
                    labelPlacement="outside"
                    variant="bordered"
                    color="primary"
                    radius="full"
                    size="lg"
                    {...register("unit")}
                    isInvalid={!!errors.unit}
                    errorMessage={errors.unit?.message as string}
                  />
                  <Input
                    type="text"
                    label="Quantity"
                    placeholder="Enter quantity"
                    labelPlacement="outside"
                    variant="bordered"
                    color="primary"
                    radius="full"
                    size="lg"
                    {...register("quantity")}
                    isInvalid={!!errors.quantity}
                    errorMessage={errors.quantity?.message as string}
                  />
                  <Input
                    type="text"
                    label="Threshold value"
                    placeholder="Enter threshold value"
                    labelPlacement="outside"
                    variant="bordered"
                    color="primary"
                    radius="full"
                    size="lg"
                    {...register("threshold")}
                    isInvalid={!!errors.threshold}
                    errorMessage={errors.threshold?.message as string}
                  />
                  <div>
                    <p className="text-primary ml-1">Color</p>
                    <div className="flex gap-5 p-3">
                      <Checkbox
                        aria-label="check is color"
                        classNames={{
                          base: cn(
                            "inline-flex w-2/3 max-w-xl bg-content1",
                            "hover:bg-content2 items-center justify-start",
                            "cursor-pointer rounded-full gap-2 p-4 border-2 border-transparent",
                            "data-[selected=true]:border-primary"
                          ),
                          label: "w-full",
                        }}
                        isSelected={isColor}
                        onValueChange={setIsColor}
                      >
                        Is color
                      </Checkbox>

                      {isColor && (
                        <div className="flex items-center gap-4 transition-all duration-300 ease-in-out">
                          <Popover
                            isOpen={isColorPickerOpen}
                            onOpenChange={(open) => setIsColorPickerOpen(open)}
                          >
                            <PopoverTrigger>
                              <Button
                                className="min-w-[120px] h-12"
                                radius="full"
                                size="lg"
                                style={{
                                  backgroundColor: colorCode,
                                  color: getContrastColor(colorCode),
                                }}
                                onClick={() => setIsColorPickerOpen(true)}
                              >
                                {colorCode}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div ref={colorPickerRef}>
                                <HexColorPicker
                                  color={colorCode}
                                  onChange={handleColorChange}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center mt-5 w-full">
                    <div className="flex flex-col justify-center items-center gap-3 w-1/3">
                      <Button
                        size="lg"
                        color="primary"
                        radius="full"
                        className="text-white"
                        type="submit"
                        fullWidth
                        isLoading={isSubmitting}
                        isDisabled={!isValid}
                      >
                        {material ? (
                          <div>
                            <p>Save</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaPlus />
                            <p>Add material</p>
                          </div>
                        )}
                      </Button>
                      {material ? (
                        <Button
                          size="lg"
                          color="primary"
                          variant="bordered"
                          radius="full"
                          fullWidth
                          onClick={popupModal.onOpen}
                        >
                          <p>Delete</p>
                        </Button>
                      ) : null}
                      <p className="text-danger">
                        {error ?? `Error: ${error}`}
                      </p>
                    </div>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <PopupModal
        message={"Are you sure to delete this material?"}
        isOpen={popupModal.isOpen}
        onClose={popupModal.onOpenChange}
        buttonTitle="Confirm"
        buttonFunction={handleDelete}
      />
    </div>
  );
}

function SkeletonLoading() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

"use client";

import {
  type SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import TabsSelect from "@/components/tabs-select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { type Key, useTransition } from "react";
import AllMeterial from "./all-meterial";
import { Button } from "@heroui/button";
import { FaPlus } from "react-icons/fa";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { useForm } from "react-hook-form";
import {
  createMaterialSchema,
  type CreateMaterialSchema,
} from "@/lib/schemas/createMaterialSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Skeleton } from "@heroui/skeleton";
import type { Material } from "@/interfaces/material.interface";
import PopupModal from "@/components/popup-modal";
import AllRequisition from "./all-requisition";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { getContrastColor } from "@/utils/get-contrast-color";
import { Checkbox } from "@heroui/checkbox";
import { cn } from "@heroui/theme";
import {
  useCreateMaterialsMutation,
  useDeleteMaterialsMutation,
  useFetchMaterialsQuery,
  useFetchRequisitionsQuery,
  useUpdateMaterialsMutation,
} from "@/store";

function StockContent() {
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

  const {
    currentData: materials,
    isLoading: isLoadingMaterials,
    isSuccess: isSuccessMaterials,
  } = useFetchMaterialsQuery(session.data?.accessToken || "");

  const {
    currentData: requisitions,
    isLoading: isLoadingRequisitions,
    isSuccess: isSuccessRequisitions,
  } = useFetchRequisitionsQuery(session.data?.accessToken || "");

  const [createMaterial] = useCreateMaterialsMutation();
  const [updateMaterial] = useUpdateMaterialsMutation();
  const [deleteMaterial, resultsDeleteMaterial] = useDeleteMaterialsMutation();

  const [material, setMaterial] = useState<Material | null>();

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
        return isLoadingMaterials ||
          isLoadingRequisitions ||
          !isSuccessMaterials ||
          !isSuccessRequisitions ? (
          <SkeletonLoading />
        ) : (
          <AllMeterial materials={materials} handleEdit={handleEdit} />
        );
      case "All requisition":
        return isLoadingMaterials ||
          isLoadingRequisitions ||
          !isSuccessMaterials ||
          !isSuccessRequisitions ? (
          <SkeletonLoading />
        ) : (
          <AllRequisition requisitions={requisitions} />
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

  const handleColorChange = (color: SetStateAction<string>) => {
    setColorCode(color);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node)
    ) {
      setIsColorPickerOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const onSubmit = async (data: CreateMaterialSchema) => {
    try {
      let submissionData: CreateMaterialSchema & { color?: string };

      if (isColor) {
        submissionData = { ...data, color: colorCode };
      } else {
        submissionData = { ...data };
      }

      if (material) {
        const dataWithId = { id: material.id, ...submissionData };
        await updateMaterial({
          data: dataWithId,
          accessToken: session.data?.accessToken || "",
        });
      } else {
        await createMaterial({
          data: submissionData,
          accessToken: session.data?.accessToken || "",
        });
      }

      editModal.onOpenChange();
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMaterial({
        id: material?.id,
        accessToken: session.data?.accessToken || "",
      });

      setMaterial(null);
      popupModal.onOpenChange();
      editModal.onOpenChange();
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
    if (material.color) {
      setIsColor(true);
      setColorCode(material.color);
    } else {
      setIsColor(false);
      setColorCode("#000000");
    }
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
            onPress={() => {
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
            <div key={tab.id} className="mt-5">
              {isLoadingMaterials || isLoadingRequisitions ? (
                <SkeletonLoading />
              ) : (
                getStepContent(tab.label)
              )}
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
                        isDisabled={material !== null}
                        isSelected={isColor}
                        onValueChange={setIsColor}
                      >
                        Is color
                      </Checkbox>

                      {isColor && (
                        <div className="flex items-center gap-4 transition-all duration-300 ease-in-out border-primary border-2 rounded-full">
                          <Popover
                            isOpen={isColorPickerOpen}
                            onOpenChange={(open) => setIsColorPickerOpen(open)}
                          >
                            <PopoverTrigger>
                              <Button
                                className="min-w-[120px] h-12"
                                radius="full"
                                size="lg"
                                isDisabled={material !== null}
                                style={{
                                  backgroundColor: colorCode,
                                  color: getContrastColor(colorCode),
                                }}
                                onPress={() => setIsColorPickerOpen(true)}
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
                          onPress={popupModal.onOpen}
                          isLoading={resultsDeleteMaterial.isLoading}
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

export default function StockTab() {
  return (
    <div className="mb-40 w-full">
      <Suspense
        fallback={
          <div className="flex flex-col gap-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        }
      >
        <StockContent />
      </Suspense>
    </div>
  );
}

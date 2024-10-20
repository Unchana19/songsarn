import { Material } from "@/interfaces/material.interface";
import {
  CreateRequisitionSchema,
  createRequisitionSchema,
} from "@/lib/schemas/createRequisitionSchema";
import { getAvailabilityStatus } from "@/utils/get-availability-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";

interface Props {
  materials: Material[];
  handleEdit: (material: Material) => void;
  fetchRequisition: () => void;
}

export default function AllMeterial({
  materials,
  handleEdit,
  fetchRequisition,
}: Props) {
  const session = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [material, setMaterial] = useState<Material>();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateRequisitionSchema>({
    resolver: zodResolver(createRequisitionSchema),
    mode: "onTouched",
  });

  const handleRequisition = (material: Material) => {
    setMaterial(material);
    onOpen();
  };

  const onSubmit = async (data: CreateRequisitionSchema) => {
    try {
      const dataWithMeterialId = { materialId: material?.id, ...data };
      const response = await fetch("/api/requisitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify(dataWithMeterialId),
      });
      const result = await response.json();
      if (response.ok) {
        setError("");
        onOpenChange();
        await fetchRequisition();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="w-full">
      <Table aria-label="Material management table" className="w-full">
        <TableHeader>
          <TableColumn>Material</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Threshold value</TableColumn>
          <TableColumn>Availability</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No materials to display."}>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {material.color && (
                    <div
                      className="w-4 h-4 rounded-full border-primary border-1"
                      style={{ backgroundColor: material.color }}
                    />
                  )}
                  {material.name}
                </div>
              </TableCell>
              <TableCell>{`${material.quantity} ${material.unit}`}</TableCell>
              <TableCell>{`${material.threshold} ${material.unit}`}</TableCell>
              <TableCell>
                <Chip
                  color={
                    getAvailabilityStatus(material.quantity, material.threshold)
                      .color
                  }
                  size="sm"
                  variant="flat"
                >
                  {
                    getAvailabilityStatus(material.quantity, material.threshold)
                      .label
                  }
                </Chip>
              </TableCell>
              <TableCell className="flex gap-5">
                <Button
                  variant="flat"
                  color="primary"
                  radius="full"
                  onClick={() => handleEdit(material)}
                  startContent={<FiEdit />}
                >
                  Edit
                </Button>
                <Button
                  color="primary"
                  radius="full"
                  className="text-white"
                  onClick={() => handleRequisition(material)}
                >
                  Send requisition
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        className="flex justify-center items-center px-3 py-5 text-lg"
      >
        <ModalContent className="flex items-center justify-center w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">
                Requisition
              </ModalHeader>
              <ModalBody className="w-full flex justify-center">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex justify-center w-full gap-5">
                    <div className="flex flex-col w-1/3 gap-5">
                      <p className="text-primary">Material name</p>
                      <p className="text-primary">Quantity</p>
                      <p className="text-primary">Threshold value</p>
                    </div>
                    <div className="flex flex-col gap-5">
                      <p>{material?.name}</p>
                      <p>
                        {material?.quantity} {material?.unit}
                      </p>
                      <p>
                        {material?.threshold} {material?.unit}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex justify-center mt-10">
                    <div className="w-1/2">
                      <Input
                        type="text"
                        label="Requested quantity"
                        placeholder="Enter requested quantity"
                        labelPlacement="outside"
                        variant="bordered"
                        color="primary"
                        radius="full"
                        size="lg"
                        {...register("quantity")}
                        isInvalid={!!errors.quantity}
                        errorMessage={errors.quantity?.message as string}
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-center items-center mt-5">
                    <div className="w-1/3 flex flex-col gap-3">
                      <Button
                        type="submit"
                        fullWidth
                        radius="full"
                        color="primary"
                        isLoading={isSubmitting}
                        isDisabled={!isValid}
                      >
                        <p className="text-lg text-white">Send</p>
                      </Button>
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
    </div>
  );
}

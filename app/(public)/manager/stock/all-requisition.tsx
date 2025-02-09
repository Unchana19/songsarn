import type { Requisition } from "@/interfaces/requisition.interface";
import {
  type CreateMPOSchema,
  createMPOSchema,
} from "@/lib/schemas/createMPOSchema";
import { convertTimestampToDateTime } from "@/utils/convert-timestamp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  type Selection,
} from "@heroui/table";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";

interface Props {
  requisitions: Requisition[];
  fetchRequisition: () => void;
}

export default function AllRequisition({
  requisitions,
  fetchRequisition,
}: Props) {
  const session = useSession();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
  const [selectedRequisitions, setSelectedRequisitions] = useState<
    Requisition[]
  >([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [error, setError] = useState("");

  const filterSeletedRequisitions = () => {
    setSelectedRequisitions(
      requisitions.filter((requisition) => selectedKeys.has(requisition.id))
    );
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateMPOSchema>({
    resolver: zodResolver(createMPOSchema),
    mode: "onTouched",
  });

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      if (keys.toString() === "all") {
        setSelectedKeys(new Set(requisitions.map((req) => req.id)));
      } else if (keys.toString() === "none") {
        setSelectedKeys(new Set([]));
      } else {
        setSelectedKeys(new Set(keys as unknown as string[]));
      }
    },
    [requisitions]
  );

  const handleCreateOrder = () => {
    filterSeletedRequisitions();
    onOpen();
  };

  const onSubmit = async (data: CreateMPOSchema) => {
    try {
      const dataRequisition = selectedRequisitions.map((requisition) => ({
        material_id: requisition.material_id,
        quantity: requisition.quantity,
        requisition_id: requisition.id,
      }));
      const dataWithMeterial = { ...data, material: [...dataRequisition] };
      const response = await fetch("/api/material-purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify(dataWithMeterial),
      });
      const result = await response.json();
      if (response.ok) {
        setError("");
        onOpenChange();
        fetchRequisition();
      } else {
        setError(result.message);
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        label="Supplier name"
        placeholder="Enter Supplier name"
        labelPlacement="outside"
        variant="bordered"
        color="primary"
        radius="full"
        size="lg"
        className="py-5"
        {...register("supplier")}
        isInvalid={!!errors.supplier}
        errorMessage={errors.supplier?.message as string}
      />
      <Table
        color="primary"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => handleSelectionChange(keys)}
        selectionMode="multiple"
        aria-label="Requisition management table"
        className="w-full"
      >
        <TableHeader>
          <TableColumn>Material</TableColumn>
          <TableColumn>Requested quantity</TableColumn>
          <TableColumn>Requisition date and time</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No requisitions to display."}>
          {requisitions.map((requisition) => (
            <TableRow key={requisition.id}>
              <TableCell>{requisition.material_name}</TableCell>
              <TableCell>{`${requisition.quantity} ${requisition.unit}`}</TableCell>
              <TableCell>
                {convertTimestampToDateTime(requisition.create_date_time)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={handleCreateOrder}
        size="lg"
        color="primary"
        radius="full"
        className="text-white mt-5"
        isLoading={isSubmitting}
        isDisabled={!isValid || selectedKeys.size === 0}
      >
        <FaPlus />
        <p>Create order</p>
      </Button>
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
                Create order
              </ModalHeader>
              <ModalBody className="w-full flex justify-center">
                <div className="flex justify-center w-full gap-5">
                  <div className="flex flex-col w-1/3 gap-5">
                    <p className="text-primary mb-5">Supplier</p>
                    <p className="text-primary">Material</p>
                  </div>
                  <div className="flex flex-col gap-5">
                    <p className="mb-5">{getValues("supplier")}</p>
                    {selectedRequisitions.map((requisition) => (
                      <p key={requisition.id}>{requisition.material_name}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center mt-5 w-full">
                  <div className="flex flex-col justify-center items-center gap-3 w-1/3">
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      size="lg"
                      color="primary"
                      radius="full"
                      className="text-white"
                      type="submit"
                      fullWidth
                      isLoading={isSubmitting}
                    >
                      <div className="flex items-center gap-2">
                        <p>Confirm</p>
                      </div>
                    </Button>

                    <Button
                      onClick={onClose}
                      size="lg"
                      variant="light"
                      radius="full"
                      fullWidth
                    >
                      <p>Cancel</p>
                    </Button>

                    <p className="text-danger">{error ?? `Error: ${error}`}</p>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </form>
  );
}

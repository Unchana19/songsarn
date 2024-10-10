import { Material } from "@/interfaces/material.interface";
import { getAvailabilityStatus } from "@/utils/get-availability-status";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
import { useState } from "react";
import { FiEdit } from "react-icons/fi";

interface Props {
  materials: Material[];
  handleEdit: (material: Material) => void;
}

export default function AllMeterial({ materials, handleEdit }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [material, setMaterial] = useState<Material>();
  const handleRequisition = (material: Material) => {
    setMaterial(material);
    onOpen();
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
              <TableCell>{material.name}</TableCell>
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
        className="flex justify-center items-center px-3 py-5"
      >
        <ModalContent className="flex items-center justify-center w-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Requisition
              </ModalHeader>
              <ModalBody className="w-full flex justify-center">
                <div className="flex justify-center w-full gap-5">
                  <div className="flex flex-col w-1/3 gap-3">
                    <p className="text-primary">Material name</p>
                    <p className="text-primary">Quantity</p>
                    <p className="text-primary">Threshold value</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p>{material?.name}</p>
                    <p>
                      {material?.quantity} {material?.unit}
                    </p>
                    <p>
                      {material?.threshold} {material?.unit}
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-center mt-5">
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
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="w-1/3">
                <Button
                  fullWidth
                  radius="full"
                  color="primary"
                  onPress={onClose}
                >
                  <p className="text-lg text-white">Send</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

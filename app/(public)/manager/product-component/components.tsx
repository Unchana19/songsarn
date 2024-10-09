"use client";

import PopupModal from "@/components/popup-modal";
import { Component } from "@/interfaces/component.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useDisclosure } from "@nextui-org/modal";
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Props {
  label: string;
  category?: string;
  components: Component[];
  handleEdit: (component?: Component | null) => void;
  handleDelete: (componentId: string) => void;
}

export default function ComponentsPage({
  label,
  category,
  components,
  handleEdit,
  handleDelete,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <div className="flex items-center gap-10">
        <p className="font-bold">{category}</p>
        <Button
          onClick={() => handleEdit()}
          color="primary"
          radius="full"
          className="text-white"
        >
          <FaPlus />
          <p>Add component</p>
        </Button>
      </div>
      <div className="flex flex-wrap mt-5 gap-10 justify-start">
        {components.map((component) => (
          <Card shadow="sm" className="w-full md:w-1/4 xl:w-1/6 p-1">
            <CardHeader className="overflow-hidden flex justify-center pt-5">
              <Image
                src={component.img}
                alt={component.name}
                height={200}
                className="object-cover"
              />
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="flex flex-col">
                <p>{component.name}</p>
                <p className="text-lg font-bold">
                  {formatNumberWithComma(component.price)}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={onOpen}
                  isIconOnly
                  color="primary"
                  variant="light"
                >
                  <RiDeleteBin5Line size={20} />
                </Button>

                <Button
                  color="primary"
                  className="text-white"
                  radius="full"
                  onClick={() => handleEdit(component)}
                >
                  <FiEdit />
                  <p>Edit</p>
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <PopupModal
        message={"Are you sure to delete this component?"}
        isOpen={isOpen}
        onClose={onOpenChange}
        buttonTitle={"Confirm"}
        buttonFunction={handleDelete}
      />
    </div>
  );
}

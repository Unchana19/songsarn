"use client";

import PopupModal from "@/components/popup-modal";
import { Category } from "@/interfaces/category.interface";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useDisclosure } from "@nextui-org/modal";
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Props {
  label: string;
  categories: Category[] | null | undefined;
  handleSeeAll: (category: Category, label: string) => void;
  handleEdit: (category?: Category | null) => void;
  handleDelete: (categoryId: string) => void;
}

export default function CategoriesPage({
  label,
  categories,
  handleSeeAll,
  handleEdit,
  handleDelete,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <div className="flex items-center gap-10">
        <p className="font-bold">{label} categories</p>
        <Button
          onClick={() => handleEdit()}
          color="primary"
          radius="full"
          className="text-white"
        >
          <FaPlus />
          <p>Add category</p>
        </Button>
      </div>
      <div className="flex flex-wrap mt-5 justify-start">
        {categories?.map((category) => (
          <div className="w-full md:w-1/2 xl:w-1/4 p-5">
            <Card shadow="sm" className="w-full">
              <CardHeader className="overflow-hidden flex justify-center pt-5">
                <Image
                  src={category.img}
                  alt={category.name}
                  height={200}
                  className="object-cover"
                />
              </CardHeader>
              <CardBody className="flex flex-col gap-4">
                <div className="p-2 border-primary border-2 rounded-xl text-center">
                  <p>{category.name}</p>
                </div>
                <Button
                  onClick={() => handleSeeAll(category, label)}
                  color="primary"
                  radius="full"
                >
                  <p className="text-white">See all</p>
                </Button>
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
                    onClick={() => handleEdit(category)}
                  >
                    <FiEdit />
                    <p>Edit</p>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
      <PopupModal
        message={"Are you sure to delete this category?"}
        isOpen={isOpen}
        onClose={onOpenChange}
        buttonTitle={"Confirm"}
        buttonFunction={handleDelete}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import ImagePlaceholder from "@/components/image-placeholder";
import PopupModal from "@/components/popup-modal";
import type { Category } from "@/interfaces/category.interface";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { useDisclosure } from "@heroui/modal";
import { FaPlus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import EmptyComponents from "@/components/empty-components";
import { useSearchParams } from "next/navigation";

interface Props {
  label: string;
  categories: Category[];
  handleSeeAll: (category: Category, label: string) => void;
  handleEdit: (category: Category | null) => void;
  handleDelete: (categoryId: string) => void;
}

export default function CategoriesPage({
  label,
  categories,
  handleSeeAll,
  handleEdit,
  handleDelete,
}: Props) {
  const searchParams = useSearchParams();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const currentTab = searchParams.get("type") || "product";
    return categories.filter((category) => {
      if (currentTab === "product") {
        return category.type === "product";
      }
      return category.type === "component";
    });
  }, [categories, searchParams]);

  const openDeleteModal = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    onOpen();
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      handleDelete(categoryToDelete);
      setCategoryToDelete(null);
      onOpenChange();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-10">
        <p className="font-bold">{label} categories</p>
        <Button
          onPress={() => handleEdit(null)}
          color="primary"
          radius="full"
          className="text-white"
        >
          <FaPlus />
          <p>Add category</p>
        </Button>
      </div>
      {filteredCategories?.length > 0 ? (
        <div className="flex flex-wrap mt-5 justify-start">
          {filteredCategories?.map((category) => (
            <div key={category.id} className="w-full md:w-1/2 xl:w-1/4 p-5">
              <Card shadow="sm" className="w-full">
                <CardHeader className="overflow-hidden flex justify-center pt-5">
                  {category.img ? (
                    <Image
                      src={category.img}
                      alt={category.name}
                      height={200}
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlaceholder
                      name={category.name}
                      classNames="w-full h-[200px]"
                    />
                  )}
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                  <div className="p-2 border-primary border-2 rounded-xl text-center">
                    <p>{category.name}</p>
                  </div>
                  <Button
                    onPress={() => handleSeeAll(category, label)}
                    color="primary"
                    radius="full"
                  >
                    <p className="text-white">See all</p>
                  </Button>
                  <div className="flex justify-center gap-4">
                    <Button
                      onPress={() => openDeleteModal(category.id)}
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
                      onPress={() => handleEdit(category)}
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
      ) : (
        <EmptyComponents
          title={"Category is empty"}
          subTitle={"Let's create category"}
        />
      )}
      <PopupModal
        message={"Are you sure to delete this category?"}
        isOpen={isOpen}
        onClose={() => {
          onOpenChange();
          setCategoryToDelete(null);
        }}
        buttonTitle={"Confirm"}
        buttonFunction={confirmDelete}
      />
    </div>
  );
}

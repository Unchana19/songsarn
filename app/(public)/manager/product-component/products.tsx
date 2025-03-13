"use client";

import EmptyComponents from "@/components/empty-components";
import PopupModal from "@/components/popup-modal";
import type { Product } from "@/interfaces/product.interface";
import { useFetchProductsByCategoryQuery } from "@/store";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { useDisclosure } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Props {
  label: string;
  categoryId: string;
  handleEdit: (product: Product | null) => void;
  handleDelete: (productId: string) => void;
  handleBack: () => void;
}

export default function ProductsPage({
  label,
  categoryId,
  handleEdit,
  handleDelete,
  handleBack,
}: Props) {
  const {
    currentData: products,
    isLoading,
    isSuccess,
  } = useFetchProductsByCategoryQuery(categoryId);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (componentId: string) => {
    setProductToDelete(componentId);
    onOpen();
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      handleDelete(productToDelete);
      setProductToDelete(null);
      onOpenChange();
    }
  };
  const LoadingSkeleton = () => (
    <div className="w-full md:w-1/2 xl:w-1/4 p-5">
      <Card shadow="sm" className="w-full">
        <CardHeader className="overflow-hidden flex justify-center pt-5">
          <Skeleton className="rounded-lg">
            <div className="h-[200px] w-full rounded-lg bg-default-300" />
          </Skeleton>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <div className="flex justify-center gap-4">
            <Skeleton className="rounded-full">
              <div className="h-10 w-10 rounded-full bg-default-300" />
            </Skeleton>
            <Skeleton className="rounded-full">
              <div className="h-10 w-24 rounded-full bg-default-300" />
            </Skeleton>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-10">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-5">
            <p className="font-bold">{label}</p>
            <Button
              onPress={() => handleEdit(null)}
              color="primary"
              radius="full"
              className="text-white"
            >
              <FaPlus />
              <p>Add product</p>
            </Button>
          </div>
          <Button
            onPress={() => handleBack()}
            color="primary"
            variant="bordered"
            radius="full"
          >
            <FaArrowLeftLong />
            <p>Back to category</p>
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap mt-5 justify-start">
        {isLoading || !isSuccess ? (
          Array(8)
            .fill(null)
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            .map((_, index) => <LoadingSkeleton key={index} />)
        ) : products.length === 0 ? (
          <EmptyComponents
            title="No Products Found"
            subTitle="There are no products in this category yet."
            button={
              <Button
                onPress={() => handleEdit(null)}
                color="primary"
                radius="full"
                className="text-white"
              >
                <FaPlus />
                <p>Add New Component</p>
              </Button>
            }
          />
        ) : (
          products.map((product: Product) => (
            <div key={product.id} className="w-full md:w-1/2 xl:w-1/4 p-5">
              <Card shadow="sm" className="w-full">
                <CardHeader className="overflow-hidden flex justify-center pt-5">
                  <Image
                    src={product.img}
                    alt={product.name}
                    height={250}
                    className="object-cover"
                  />
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <p>{product.name}</p>
                    <p className="text-lg font-bold">
                      {formatNumberWithComma(product.price)}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button
                      onPress={() => handleDeleteClick(product.id)}
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
                      onPress={() => handleEdit(product)}
                    >
                      <FiEdit />
                      <p>Edit</p>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))
        )}
      </div>
      <PopupModal
        message={"Are you sure to delete this product?"}
        isOpen={isOpen}
        onClose={onOpenChange}
        buttonTitle={"Confirm"}
        buttonFunction={confirmDelete}
      />
    </div>
  );
}

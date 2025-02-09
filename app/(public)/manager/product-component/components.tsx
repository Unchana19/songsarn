"use client";

import PopupModal from "@/components/popup-modal";
import { Component } from "@/interfaces/component.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { useDisclosure } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsBox } from "react-icons/bs";
import ImagePlaceholder from "@/components/image-placeholder";
import EmptyComponents from "@/components/empty-components";

interface Props {
  label: string;
  categoryId: string;
  handleEdit: (component: Component | null) => void;
  handleDelete: (componentId: string) => void;
  handleBack: () => void;
}

export default function ComponentsPage({
  label,
  categoryId,
  handleEdit,
  handleDelete,
  handleBack,
}: Props) {
  const session = useSession();
  const [components, setComponents] = useState<Component[]>([]);
  const [componentsFilter, setComponentsFilter] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [componentToDelete, setComponentToDelete] = useState<string | null>(
    null
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDeleteClick = (componentId: string) => {
    setComponentToDelete(componentId);
    onOpen();
  };

  const confirmDelete = async () => {
    if (componentToDelete) {
      handleDelete(componentToDelete);
      setComponentToDelete(null);
      fetchComponents();
      onOpenChange();
    }
  };

  const filterComponents = (categoryId: string) => {
    const filtered = components.filter(
      (component) => component.category_id === categoryId
    );
    setComponentsFilter(filtered);
  };

  const fetchComponents = async () => {
    try {
      setIsLoading(true);
      const token = session.data?.accessToken;
      const response = await fetch("/api/components", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setComponents(result);
      }
    } catch (error) {
      setMessage(error as string);
      onOpenChange();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [session]);

  useEffect(() => {
    if (components.length > 0 && categoryId) {
      filterComponents(categoryId);
    }
  }, [components, categoryId]);

  const LoadingSkeleton = () => (
    <div className="w-full md:w-1/2 xl:w-1/4 p-5">
      <Card shadow="sm" className="w-full">
        <CardHeader className="overflow-hidden flex justify-center pt-5">
          <Skeleton className="rounded-lg">
            <div className="h-[200px] w-full rounded-lg bg-default-300"></div>
          </Skeleton>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <div className="flex justify-center gap-4">
            <Skeleton className="rounded-full">
              <div className="h-10 w-10 rounded-full bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-full">
              <div className="h-10 w-24 rounded-full bg-default-300"></div>
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
              onClick={() => handleEdit(null)}
              color="primary"
              radius="full"
              className="text-white"
            >
              <FaPlus />
              <p>Add New Component</p>
            </Button>
          </div>
          <Button
            onClick={() => handleBack()}
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
        {isLoading ? (
          Array(8)
            .fill(null)
            .map((_, index) => <LoadingSkeleton key={index} />)
        ) : componentsFilter.length === 0 ? (
          <EmptyComponents
            title="No Components Found"
            subTitle="There are no components in this category yet."
            button={
              <Button
                onClick={() => handleEdit(null)}
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
          componentsFilter.map((component) => (
            <div key={component.id} className="w-full md:w-1/2 xl:w-1/4 p-5">
              <Card shadow="sm" className="w-full">
                <CardHeader className="overflow-hidden flex justify-center pt-5">
                  {component.img ? (
                    <Image
                      src={component.img}
                      alt={component.name}
                      height={200}
                      className="object-cover"
                    />
                  ) : (
                    <ImagePlaceholder
                      name={component.name}
                      classNames="w-full h-[200px]"
                    />
                  )}
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
                      onClick={() => handleDeleteClick(component.id)}
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
            </div>
          ))
        )}
      </div>
      <PopupModal
        message={"Are you sure to delete this component?"}
        isOpen={isOpen}
        onClose={onOpenChange}
        buttonTitle={"Confirm"}
        buttonFunction={confirmDelete}
      />
    </div>
  );
}

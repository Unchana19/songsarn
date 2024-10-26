"use client";

import PopupModal from "@/components/popup-modal";
import { Product } from "@/interfaces/product.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useDisclosure } from "@nextui-org/modal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  const session = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsFilter, setProductsFilter] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [message, setMessage] = useState("");
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = session.data?.accessToken;
      const response = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setProducts(result);
      }
    } catch (error) {
      setMessage(error as string);
      onOpenChange();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [session]);

  const filterProducts = (categoryId: string) => {
    const filtered = products.filter(
      (product) => product.category_id === categoryId
    );
    setProductsFilter(filtered);
  };

  useEffect(() => {
    if (products.length > 0 && categoryId) {
      filterProducts(categoryId);
    }
  }, [products, categoryId]);

  const handleDeleteClick = (componentId: string) => {
    setProductToDelete(componentId);
    onOpen();
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      handleDelete(productToDelete);
      setProductToDelete(null);
      fetchProducts();
      onOpenChange();
    }
  };

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
              <p>Add product</p>
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
        {productsFilter.map((product) => (
          <div className="w-full md:w-1/2 xl:w-1/4 p-5">
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
                    onClick={() => handleDeleteClick(product.id)}
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
                    onClick={() => handleEdit(product)}
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
        message={"Are you sure to delete this product?"}
        isOpen={isOpen}
        onClose={onOpenChange}
        buttonTitle={"Confirm"}
        buttonFunction={confirmDelete}
      />
    </div>
  );
}

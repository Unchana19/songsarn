"use client";

import ImagePlaceholder from "@/components/image-placeholder";
import PopupModal from "@/components/popup-modal";
import { ProductDetail } from "@/interfaces/product-detail.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { useDisclosure } from "@nextui-org/modal";
import { Skeleton } from "@nextui-org/skeleton";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function ProductDetailPage() {
  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [product, setProduct] = useState<ProductDetail | null>();
  const [isLoading, setIsLoading] = useState(true);

  const [modalMessage, setModalMessage] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/find-by-id?id=${id}`);
      const result = await response.json();
      if (response.ok) {
        setProduct(result);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const addToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      if (!session.data?.userId) {
        return;
      }

      const data = {
        product_id: product?.id,
        order_id: session.data.userId,
      };

      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage("Product added to cart successfully!");
      } else {
        setModalMessage("Failed to add product to cart");
      }
      onOpen();
    } catch (error) {
      setModalMessage("An error occurred. Please try again.");
      onOpen();
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <div className="flex justify-around mt-5">
          <div className="flex w-5/12">
            <Skeleton className="rounded-lg">
              <div className="h-[300px] w-[400px]"></div>
            </Skeleton>
          </div>
          <div className="flex w-6/12">
            <div className="flex flex-col gap-5 w-full">
              <Skeleton className="h-8 w-3/4 rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-8 w-1/4 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-2xl">Product detail</h3>
        <Button
          color="primary"
          radius="full"
          variant="bordered"
          className="text-black"
          onClick={handleBack}
        >
          <FaArrowLeftLong />
          <p>Back</p>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Product Image */}
        <div>
          <Card shadow="none" className="border-none">
            <CardBody className="p-0">
              <div className="flex justify-center w-full">
                {product?.img ? (
                  <Image
                    src={product?.img}
                    alt={product?.name}
                    width={450}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <ImagePlaceholder
                    name={product?.name.slice(0, 10) || ""}
                    classNames={"w-full h-[400px]"}
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
            <p className="text-xl text-default-600 mb-4">{product?.detail}</p>
            <p className="text-3xl font-bold text-primary">
              {formatNumberWithComma(product?.price || 0)}
            </p>
          </div>

          <Divider />

          {/* Components Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Components</h2>
            <div className="space-y-4">
              {product?.components?.map((comp, index) => (
                <Card key={index} className="bg-default-50">
                  <CardBody className="p-4">
                    <div className="flex gap-4">
                      {comp.component.img ? (
                        <Image
                          src={comp.component.img}
                          alt={comp.component.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <ImagePlaceholder
                          name={comp.component.name.slice(0, 2)}
                          classNames={"w-24 h-24"}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {comp.component.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {comp.primary_color && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{
                                  backgroundColor: comp.primary_color.color,
                                }}
                              />
                              <span className="text-sm">
                                สีหลัก: {comp.primary_color.name}
                              </span>
                            </div>
                          )}
                          {comp.pattern_color && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{
                                  backgroundColor: comp.pattern_color.color,
                                }}
                              />
                              <span className="text-sm">
                                สีลาย: {comp.pattern_color.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <Divider />

          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <Button
              size="lg"
              color="primary"
              className="w-full text-white font-medium"
              onClick={addToCart}
              startContent={<FaCartPlus size={20} />}
              isLoading={isAddingToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <PopupModal
        message={modalMessage}
        isOpen={isOpen}
        onClose={onOpenChange}
      />
    </div>
  );
}

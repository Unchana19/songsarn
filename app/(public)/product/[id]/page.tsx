"use client";

import ImagePlaceholder from "@/components/image-placeholder";
import PopupModal from "@/components/popup-modal";
import type { ProductDetail } from "@/interfaces/product-detail.interface";
import type { Product } from "@/interfaces/product.interface";
import { useAddToCartMutation, useFetchProductByIdQuery } from "@/store";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { useDisclosure } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function ProductDetailPage() {
  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: product, isLoading } = useFetchProductByIdQuery(id);

  const [addToCart, results] = useAddToCartMutation();
  const [modalMessage, setModalMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = async (product: Product) => {
    if (
      session.status === "authenticated" &&
      session.data?.userId &&
      session.data?.accessToken
    ) {
      try {
        addToCart({
          userId: session.data.userId,
          productId: product.id,
          accessToken: session.data.accessToken,
        });
      } catch (error) {
        setModalMessage("An error occurred. Please try again.");
        onOpen();
      } finally {
        setModalMessage("Product added to cart successfully");
        onOpen();
      }
    } else {
      setModalMessage("Please login to add items to cart");
      onOpen();
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
              <div className="h-[300px] w-[400px]" />
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
          onPress={handleBack}
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
              {product?.components.map((product: ProductDetail) => (
                <Card
                  shadow="sm"
                  key={product.component.id}
                  className="bg-default-50"
                >
                  <CardBody className="p-4">
                    <div className="flex gap-4">
                      {product.component.img ? (
                        <Image
                          src={product.component.img}
                          alt={product.component.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <ImagePlaceholder
                          name={product.component.name.slice(0, 2)}
                          classNames={"w-24 h-24"}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {product.component.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {product.primary_color && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{
                                  backgroundColor: product.primary_color.color,
                                }}
                              />
                              <span className="text-sm">
                                สีหลัก: {product.primary_color.name}
                              </span>
                            </div>
                          )}
                          {product.pattern_color && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{
                                  backgroundColor: product.pattern_color.color,
                                }}
                              />
                              <span className="text-sm">
                                สีลาย: {product.pattern_color.name}
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
              onPress={() => handleAddToCart(product)}
              startContent={<FaCartPlus size={20} />}
              isLoading={results.isLoading}
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

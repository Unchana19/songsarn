"use client";
import EmptyComponents from "@/components/empty-components";
import PopupModal from "@/components/popup-modal";
import ProductCardSmall from "@/components/product-card-small";
import type { Category } from "@/interfaces/category.interface";
import type { Product } from "@/interfaces/product.interface";
import {
  useAddToCartMutation,
  useFetchProductCategoriesQuery,
  useFetchProductsQuery,
} from "@/store";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaCartPlus } from "react-icons/fa";

export default function AllProductsPage() {
  const session = useSession();
  const {
    data: productsCategories,
    isLoading: isLoadingProductCategories,
  } = useFetchProductCategoriesQuery({});

  const {
    data: products,
    isLoading: isLoadingProducts,
  } = useFetchProductsQuery({});

  const [addToCart, results] = useAddToCartMutation();
  const [modalMessage, setModalMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  if (isLoadingProductCategories || isLoadingProducts) {
    return (
      (<div>
        <Skeleton className="h-8 w-32 rounded-lg mb-10" />
        <div className="flex flex-col gap-10">
          {[...Array(3)].map((_, categoryIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            (<div key={categoryIndex} className="flex flex-col">
              <div className="flex justify-between mb-5">
                <Skeleton className="h-6 w-40 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
              <div className="flex flex-wrap justify-start">
                {[...Array(4)].map((_, productIndex) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={productIndex}
                    className="w-full md:w-1/2 xl:w-1/4 p-5"
                  >
                    <Card className="w-full space-y-5 p-4">
                      <Skeleton className="rounded-lg">
                        <div className="h-52 rounded-lg bg-default-300" />
                      </Skeleton>
                      <div className="space-y-3">
                        <Skeleton className="w-3/5 rounded-lg">
                          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                          <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                        </Skeleton>
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="w-32 rounded-lg">
                          <div className="h-10 rounded-lg bg-default-200" />
                        </Skeleton>
                        <Skeleton className="w-10 rounded-lg">
                          <div className="h-10 rounded-lg bg-default-200" />
                        </Skeleton>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>)
          ))}
        </div>
      </div>)
    );
  }

  return (
    <div>
      <h2 className="font-bold text-lg">All products</h2>
      <div className="flex flex-col mt-10 gap-10">
        {productsCategories.map((category: Category) => {
          const productsFilter = products.filter(
            (product: Product) => product.category_id === category.id
          );
          return (
            <div key={category.id} className="flex flex-col">
              <div className="flex justify-between mb-5">
                <div>{category.name}</div>
                <Button
                  as={Link}
                  href={`/all-products/${category.id}`}
                  color="primary"
                  radius="full"
                  className="text-white"
                >
                  <p className="text-wrap">See all {category.name}</p>
                </Button>
              </div>
              <div className="flex flex-wrap justify-start min-h-[200px]">
                {productsFilter.length > 0 ? (
                  productsFilter.map((product: Product, index: number) => (
                    <div
                      key={product.id}
                      className="w-full md:w-1/2 xl:w-1/4 p-5"
                    >
                      <Link href={`/product/${product.id}`}>
                        <ProductCardSmall
                          isTopSeller={index === 0}
                          product={product}
                          cardButton={
                            <div className="flex gap-4">
                              <Button
                                as={Link}
                                href={`/product/${product.id}`}
                                color="primary"
                                variant="bordered"
                              >
                                <p>See detail</p>
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                                radius="full"
                                className="z-10"
                                isIconOnly
                                color="primary"
                                isLoading={results.isLoading}
                              >
                                <FaCartPlus color="white" size={20} />
                              </Button>
                            </div>
                          }
                        />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <EmptyComponents
                      title="No products available in this category"
                      subTitle=""
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <PopupModal
        message={modalMessage}
        isOpen={isOpen}
        onClose={onOpenChange}
      />
    </div>
  );
}

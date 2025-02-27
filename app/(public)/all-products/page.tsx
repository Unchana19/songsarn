"use client";
import Loading from "@/app/loading";
import EmptyComponents from "@/components/empty-components";
import ProductCardSmall from "@/components/product-card-small";
import ShopButton from "@/components/shop-button";
import type { Category } from "@/interfaces/category.interface";
import type { Like } from "@/interfaces/like.interface";
import type { Product } from "@/interfaces/product.interface";
import {
  useAddToCartMutation,
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useFetchLikesQuery,
  useFetchProductCategoriesQuery,
  useFetchProductsQuery,
} from "@/store";
import { toastError, toastSuccess } from "@/utils/toast-config";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AllProductsPage() {
  const session = useSession();
  const { data: productsCategories, isLoading: isLoadingProductCategories } =
    useFetchProductCategoriesQuery({});

  const { data: products, isLoading: isLoadingProducts } =
    useFetchProductsQuery({});

  const { data: likes, isLoading: isLoadingLikes } = useFetchLikesQuery({
    userId: session.data?.userId,
    accessToken: session.data?.accessToken,
  });

  const [createLike, resultsCreateLike] = useCreateLikeMutation();
  const [deleteLike, resultsDeleteLike] = useDeleteLikeMutation();

  const isLike = (productId: string) => {
    return likes?.some((like: Like) => like.product_id === productId);
  };

  const [addToCart, results] = useAddToCartMutation();

  const handleLike = async (productId: string) => {
    if (
      session.status === "authenticated" &&
      session.data?.userId &&
      session.data?.accessToken
    ) {
      if (isLike(productId)) {
        const like = likes?.find((like: Like) => like.product_id === productId);
        await deleteLike({
          id: like?.id,
          accessToken: session.data.accessToken,
        });
      } else {
        await createLike({
          data: { user_id: session.data.userId, product_id: productId },
          accessToken: session.data.accessToken,
        });
      }
    } else {
      toastError("Please login to like product");
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (
      session.status === "authenticated" &&
      session.data?.userId &&
      session.data?.accessToken
    ) {
      await addToCart({
        userId: session.data.userId,
        productId: product.id,
        accessToken: session.data.accessToken,
      });

      toastSuccess("Product added to cart");
    } else {
      toastError("Please login to add product to cart");
    }
  };

  if (isLoadingProductCategories || isLoadingProducts || isLoadingLikes) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="font-bold text-lg">All products</h2>
      <div className="flex flex-col mt-10 gap-10">
        {productsCategories?.map((category: Category) => {
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
                            <ShopButton
                              product={product}
                              isLiked={isLike(product.id)}
                              handleLike={handleLike}
                              isLoadingLike={
                                resultsCreateLike.isLoading ||
                                resultsDeleteLike.isLoading
                              }
                              handleAddToCart={handleAddToCart}
                              isLoadingAddToCart={results.isLoading}
                            />
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
    </div>
  );
}

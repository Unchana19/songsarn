"use client";

import { useParams } from "next/navigation";
import type { Product } from "@/interfaces/product.interface";
import EmptyComponents from "@/components/empty-components";
import ProductCardSmall from "@/components/product-card-small";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  useAddToCartMutation,
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useFetchCategoryQuery,
  useFetchLikesQuery,
  useFetchProductsByCategoryQuery,
} from "@/store";
import Loading from "@/app/loading";
import type { Like } from "@/interfaces/like.interface";
import { toastError, toastSuccess } from "@/utils/toast-config";
import ShopButton from "@/components/shop-button";

export default function ProductCategoryPage() {
  const session = useSession();
  const params = useParams();
  const categoryId = Array.isArray(params.categoryId)
    ? params.categoryId[0]
    : params.categoryId || "";

  const { data: productCategory, isLoading: isLoadingProductCategory } =
    useFetchCategoryQuery(categoryId);

  const { data: products, isLoading: isLoadingProducts } =
    useFetchProductsByCategoryQuery(productCategory?.id);

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

  if (isLoadingProductCategory || isLoadingProducts || isLoadingLikes) {
    return <Loading />;
  }

  return (
    <div className="">
      <h3 className="font-bold text-lg">{productCategory?.name}</h3>
      <div className="flex flex-wrap justify-start min-h-[200px]">
        {products?.length > 0 ? (
          products.map((product: Product) => (
            <div key={product.id} className="w-full md:w-1/2 xl:w-1/4 p-5">
              <Link href={`/product/${product.id}`}>
                <ProductCardSmall
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
}

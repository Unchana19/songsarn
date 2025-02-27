"use client";

import Loading from "@/app/loading";
import EmptyComponents from "@/components/empty-components";
import ImagePlaceholder from "@/components/image-placeholder";
import type { Like } from "@/interfaces/like.interface";
import {
  useAddToCartMutation,
  useDeleteLikeMutation,
  useFetchLikesQuery,
} from "@/store";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { toastSuccess, toastError } from "@/utils/toast-config";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { useSession } from "next-auth/react";
import { FaCartPlus } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

export default function LikePage() {
  const session = useSession();

  const { data: products, isLoading } = useFetchLikesQuery({
    userId: session.data?.userId || "",
    accessToken: session.data?.accessToken || "",
  });

  const [deleteLike, resultsDeleteLike] = useDeleteLikeMutation();
  const [addToCart, resultsAddToCart] = useAddToCartMutation();

  const handleLike = async (likeId: string) => {
    await deleteLike({
      id: likeId,
      accessToken: session.data?.accessToken || "",
    });
  };

  const handleAddToCart = async (product: Like) => {
    if (
      session.status === "authenticated" &&
      session.data?.userId &&
      session.data?.accessToken
    ) {
      await addToCart({
        userId: session.data.userId,
        productId: product.product_id,
        accessToken: session.data.accessToken,
      }).then(async () => {
        await deleteLike({
          id: product.id,
          accessToken: session.data?.accessToken || "",
        });

        toastSuccess("Product added to cart");
      });
    } else {
      toastError("Please login to add products to cart");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Favorite products</h1>

      <div className="flex flex-col gap-5 mt-10">
        {products?.length > 0 ? (
          products?.map((product: Like, index: number) => (
            <div key={product.id}>
              <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-3/12 flex justify-center md:justify-start">
                  {product.img ? (
                    <Image
                      src={product.img}
                      alt={product.name}
                      height={200}
                      width={250}
                      className="object-cover w-full md:w-auto max-h-[200px]"
                    />
                  ) : (
                    <ImagePlaceholder
                      classNames="w-full md:w-[250px] h-[200px]"
                      name={product.name.slice(0, 10).toUpperCase()}
                    />
                  )}
                </div>
                <div className="w-full md:w-6/12 flex flex-col justify-evenly">
                  <h2 className="text-lg">{product.name}</h2>
                  <p className="text-xl font-bold">
                    {formatNumberWithComma(product.price)}
                  </p>
                </div>
                <div className="w-full md:w-3/12 flex justify-center md:justify-start gap-5 items-center mt-3 md:mt-0">
                  <Button
                    onPress={() => handleLike(product.id)}
                    isIconOnly
                    variant="light"
                    color="primary"
                    radius="full"
                    size="lg"
                    isLoading={resultsDeleteLike.isLoading}
                  >
                    <MdFavorite size={28} />
                  </Button>
                  <Button
                    onPress={() => handleAddToCart(product)}
                    radius="full"
                    className="z-10"
                    isIconOnly
                    color="primary"
                    size="lg"
                    isLoading={resultsAddToCart.isLoading}
                  >
                    <FaCartPlus color="white" size={20} />
                  </Button>
                </div>
              </div>
              {index < products.length - 1 && (
                <Divider className="my-5 border-gray-200" />
              )}
            </div>
          ))
        ) : (
          <EmptyComponents
            title="No favorite products"
            subTitle="You don't have any favorite products yet."
          />
        )}
      </div>
    </div>
  );
}

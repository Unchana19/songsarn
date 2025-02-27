"use client";

import Loading from "@/app/loading";
import ImagePlaceholder from "@/components/image-placeholder";
import type { Like } from "@/interfaces/like.interface";
import type { ProductDetail } from "@/interfaces/product-detail.interface";
import type { Product } from "@/interfaces/product.interface";
import {
  useAddToCartMutation,
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useFetchLikesQuery,
  useFetchProductByIdQuery,
} from "@/store";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { toastSuccess, toastError } from "@/utils/toast-config";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { FaCartPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

export default function ProductDetailPage() {
  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: product, isLoading: isLoadingProduct } =
    useFetchProductByIdQuery(id);

  const { data: likes, isLoading: isLoadingLikes } = useFetchLikesQuery({
    userId: session.data?.userId,
    accessToken: session.data?.accessToken,
  });

  const [createLike, resultsCreateLike] = useCreateLikeMutation();
  const [deleteLike, resultsDeleteLike] = useDeleteLikeMutation();

  const isLiked = likes?.some((like: Like) => like.product_id === id);

  const [addToCart, results] = useAddToCartMutation();

  const handleBack = () => {
    router.back();
  };

  const handleLike = async (productId: string) => {
    if (
      session.status === "authenticated" &&
      session.data?.userId &&
      session.data?.accessToken
    ) {
      if (isLiked) {
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

  if (isLoadingProduct || isLoadingLikes) {
    return <Loading />;
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
            <Button
              onPress={() => handleLike(id)}
              isIconOnly
              variant="light"
              color="primary"
              radius="full"
              size="lg"
              isLoading={
                resultsCreateLike.isLoading || resultsDeleteLike.isLoading
              }
            >
              {isLiked ? (
                <MdFavorite size={28} />
              ) : (
                <MdFavoriteBorder size={28} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

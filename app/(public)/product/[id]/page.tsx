"use client";

import { Product } from "@/interfaces/product.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Skeleton } from "@nextui-org/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>();
  const [isLoading, setIsLoading] = useState(true);

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
    <div>
      <div className="flex justify-between">
        <h3 className="font-bold text-lg">Product detail</h3>
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
      <div className="flex justify-around mt-5">
        <div className="flex w-5/12">
          <Image src={product?.img} />
        </div>
        <div className="flex w-6/12">
          <div className="flex flex-col gap-5">
            <p className="font-bold text-lg">{product?.name}</p>
            <p className="text-lg">{product?.detail}</p>
            <p className="font-bold text-xl">
              {formatNumberWithComma(product?.price || 0)}
            </p>
            <Button isIconOnly radius="full" color="primary">
              <FaCartPlus color="white" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

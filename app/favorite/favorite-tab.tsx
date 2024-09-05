"use client";

import TabsSelect from "@/components/tabs-select";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Key, useTransition } from "react";
import { FaCartPlus } from "react-icons/fa";

export type ProductCustomize = {
  id: string;
  name: string;
  price: number;
  amount: number;
};

export type ProductFinished = {
  id: string;
  name: string;
  price: number;
  amount: number;
  size: string;
  image: string;
};

interface Props {
  products: ProductCustomize[] | ProductFinished[];
}

export default function FavoriteTab({ products }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "finished", label: "Finished products" },
    { id: "customize", label: "Customize" },
  ];

  const handleTabChange = (key: Key) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const calTotal = (products: ProductCustomize[] | ProductFinished[]) => {
    return products.reduce(
      (total, product) => total + product.price * product.amount,
      0
    );
  };

  return (
    <div className="mb-40">
      <h3 className="font-bold text-xl mb-5">Favorites</h3>
      <div className="flex flex-col md:flex-row w-full">
        <div className="md:w-1/2">
          <TabsSelect
            tabs={tabs}
            handleTabChange={handleTabChange}
            isPending={isPending}
            variant="underlined"
          />

          <div>
            {tabs.map((tab) => {
              const isSelected = searchParams.get("type") === tab.id;
              const isFinished = tab.id === "finished";
              return isSelected ? (
                <div>
                  {products.length > 0 ? (
                    <div className="my-5 flex flex-col gap-10 w-full">
                      {(products as ProductFinished[]).map(
                        (product: ProductFinished) => (
                          <div>
                            <div className="flex items-center justify-evenly">
                              {isFinished && (
                                <div>
                                  <Image src={product.image} width={200} />
                                </div>
                              )}
                              <div
                                className={`flex flex-col gap-4 ${isFinished ? "w-2/3" : "w-full"}`}
                              >
                                <div className="flex flex-col md:flex-row md:justify-between">
                                  <h3 className="font-bold text-lg">
                                    {isFinished
                                      ? product.name
                                      : `Custom order no.${product.id}`}
                                  </h3>
                                  <h3 className="font-bold text-lg">
                                    {formatNumberWithComma(product.price)}
                                  </h3>
                                </div>
                                <p>
                                  {isFinished ? product.size : product.name}
                                </p>
                                <div className="flex gap-4">
                                  <div className="flex border-2 border-primary rounded-3xl items-center gap-2">
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      radius="full"
                                    >
                                      <p className="text-xl">-</p>
                                    </Button>
                                    <p className="px-3">{product.amount}</p>
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      radius="full"
                                    >
                                      <p>+</p>
                                    </Button>
                                  </div>
                                  <Button
                                    isIconOnly
                                    color="primary"
                                    radius="full"
                                  >
                                    <FaCartPlus color="white" size={20} />
                                  </Button>
                                  {!isFinished && (
                                    <Button color="primary" radius="full">
                                      <p className="text-white">Detail</p>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Divider className="mt-5 mb-10" />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div>No product for this filter</div>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
        <div className="md:w-1/2 flex mt-10 ">
          <div className="w-full flex flex-col items-center">
            <div className="md:w-2/3 w-full flex flex-col gap-4">
              <p className="font-bold">Summary</p>
              {products.map((product) => (
                <div className="flex justify-between">
                  <p>
                    {product.name} ({product.amount})
                  </p>
                  <p>{formatNumberWithComma(product.price)}</p>
                </div>
              ))}
              <Divider className="my-1" />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>{formatNumberWithComma(calTotal(products))}</p>
              </div>
              <Button
                color="primary"
                radius="full"
                startContent={<FaCartPlus color="white" size={20} />}
              >
                <p className="text-white">Add all items to cart</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

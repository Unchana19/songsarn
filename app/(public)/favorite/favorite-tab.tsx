"use client";

import CartCardComponent from "@/components/cart-card";
import TabsSelect from "@/components/tabs-select";
import { calTotal } from "@/utils/cal-total";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Key, useTransition } from "react";
import { FaCartPlus } from "react-icons/fa";

export type ProductCustomize = {
  id: string;
  name: string;
  price: number;
  amount: number;
  type: "finished" | "custom";
};

export type ProductFinished = {
  id: string;
  name: string;
  price: number;
  amount: number;
  size: string;
  image: string;
  type: "finished" | "custom";
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
                          <CartCardComponent
                            key={product.id}
                            product={product}
                            isImage={isFinished}
                          />
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
              <p className="font-bold text-lg">Summary</p>
              {products.map((product) => (
                <div className="flex justify-between">
                  <p>
                    {product.name} ({product.amount})
                  </p>
                  <p>{formatNumberWithComma(product.price * product.amount)}</p>
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
                size="lg"
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

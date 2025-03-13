"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import { MdOutlinePayments } from "react-icons/md";
import type { OrderLine } from "@/interfaces/order-line.interface";
import CartCard from "@/components/cart-card";
import { calTotal } from "@/utils/cal-total";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import EmptyComponents from "@/components/empty-components";
import Link from "next/link";
import { useCarts } from "@/hooks/useCarts";
import Loading from "@/app/loading";
import { calDeposit } from "@/utils/cal-deposit";
import { calRest } from "@/utils/cal-rest";

interface Props {
  nextPage(page: number): void;
  userId: string;
  accessToken: string;
}

export default function CartSummaryPage({
  nextPage,
  userId,
  accessToken,
}: Props) {
  const {
    orderLines,
    isLoading,
    isSuccess,
    handleIncreaseQuantityById,
    handleDecreaseQuantityById,
    handleDeleteOrderById,
  } = useCarts({ userId, accessToken });

  const goToCheckOut = () => {
    nextPage(0);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h3 className="font-bold text-xl mb-10">Your cart</h3>
      <div className="flex flex-col md:flex-row w-full">
        <div className="md:w-1/2">
          {isSuccess && orderLines?.length > 0 ? (
            <div>
              {orderLines.map((orderLine: OrderLine) => (
                <CartCard
                  key={orderLine.id}
                  orderLine={orderLine}
                  handleIncreaseQuantityById={handleIncreaseQuantityById}
                  handleDecreaseQuantityById={handleDecreaseQuantityById}
                  handleDeleteOrderById={handleDeleteOrderById}
                />
              ))}
            </div>
          ) : (
            <div>
              <EmptyComponents
                title="Your cart is empty"
                subTitle="Let's enjoy to songsarn shop"
                button={
                  <Button
                    as={Link}
                    href="/all-products"
                    color="primary"
                    radius="full"
                    className="text-white px-10"
                  >
                    Go to shop
                  </Button>
                }
              />
            </div>
          )}
        </div>
        <div className="md:w-1/2 flex mt-10">
          <div className="w-full flex flex-col items-center">
            <div className="md:w-2/3 w-full flex flex-col gap-4">
              <p className="font-bold text-lg">Summary</p>
              {isSuccess &&
                orderLines?.map((orderLine: OrderLine) => (
                  <div key={orderLine.id} className="flex justify-between">
                    <p>
                      {orderLine.name} ({orderLine.quantity})
                    </p>
                    <p>
                      {formatNumberWithComma(
                        orderLine.price * orderLine.quantity
                      )}
                    </p>
                  </div>
                ))}
              <Divider className="my-1" />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="flex flex-col justify-center">
                    <p>Deposit (20%)</p>
                    <p className="text-sm text-gray-400">Deposit is pay now</p>
                  </div>
                  <p>
                    {!isSuccess
                      ? formatNumberWithComma(0)
                      : formatNumberWithComma(calDeposit(calTotal(orderLines)))}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col justify-center">
                    <p>The rest</p>
                    <p className="text-sm text-gray-400">
                      The rest will be paid after delivery
                    </p>
                  </div>
                  <p>
                    {!isSuccess
                      ? formatNumberWithComma(0)
                      : formatNumberWithComma(calRest(calTotal(orderLines)))}
                  </p>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>
                    {!isSuccess
                      ? formatNumberWithComma(0)
                      : formatNumberWithComma(calTotal(orderLines))}
                  </p>
                </div>
              </div>
              <Button
                color="primary"
                radius="full"
                size="lg"
                startContent={<MdOutlinePayments color="white" size={20} />}
                onPress={() => goToCheckOut()}
                isDisabled={!isSuccess || orderLines?.length === 0}
              >
                <p className="text-white">Go to checkout</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

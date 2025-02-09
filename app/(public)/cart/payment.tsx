"use client";

import { calTotal } from "@/utils/cal-total";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { FiTruck } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BsBank2 } from "react-icons/bs";
import { MdOutlinePayment, MdOutlineQrCodeScanner } from "react-icons/md";
import { Dispatch, SetStateAction, useState } from "react";
import { OrderLine } from "@/interfaces/order-line.interface";
import { FormData } from "./page";
import { useSession } from "next-auth/react";
import CartCard from "@/components/cart-card";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  orderLines: OrderLine[];
  prevPage(page: number): void;
}

export default function PaymentPage({
  userId,
  orderLines,
  formData,
  setFormData,
  prevPage,
}: Props) {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const backToDelivery = () => {
    prevPage(2);
  };

  const changePaymentMethod = (payment: string) => {
    setFormData((prev) => ({
      ...prev,
      payment_method: payment,
    }));
  };

  const placeOrder = async () => {
    try {
      setIsLoading(true);
      const dataOrderLines = orderLines.map((ol) => ({
        id: ol.id,
        product_id: ol.product_id,
        quantity: ol.quantity,
      }));
      const dataCPO = {
        user_id: userId,
        delivery_price: formData.delivery_price,
        address: formData.address,
        total_price: calTotal(orderLines) + formData.delivery_price,
        phone_number: formData.phone_number,
        payment_method: formData.payment_method,
      };
      const dataWithOrderLines = {
        ...dataCPO,
        order_lines: [...dataOrderLines],
      };
      const response = await fetch("/api/customer-purchase-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify(dataWithOrderLines),
      });
      const result = await response.json();
      if (response.ok) {
        router.push(`my-order/detail/${result.id}`);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-10 mb-20">
        <Button
          radius="full"
          isIconOnly
          className="p-10 opacity-100"
          variant="light"
          isDisabled
        >
          <div className="flex flex-col items-center">
            <FiTruck size={25} />
            <p>Delivery</p>
          </div>
        </Button>
        <div className="bg-black h-1 w-1/5 rounded-full"></div>
        <Button
          radius="full"
          isIconOnly
          className="p-10 opacity-100"
          color="primary"
          variant="light"
          isDisabled
        >
          <div className="flex flex-col items-center">
            <MdOutlinePayment size={25} />
            <p>Payment</p>
          </div>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-around">
        <div className="flex flex-col md:w-5/12 items-center gap-5">
          <div className="flex flex-col gap-4 w-full">
            <h3 className="font-bold text-xl">How would you like to pay?</h3>
            <Button
              variant="bordered"
              color={formData.payment_method === "qr" ? "primary" : "default"}
              fullWidth
              size="lg"
              disableRipple
              onClick={() => changePaymentMethod("qr")}
            >
              <div className="flex items-start w-full gap-4 px-4">
                <MdOutlineQrCodeScanner size={20} />
                <p>Promptpay QR code</p>
              </div>
            </Button>
            <Button
              isDisabled
              variant="bordered"
              color={
                formData.payment_method === "mobile" ? "primary" : "default"
              }
              fullWidth
              size="lg"
              disableRipple
              onClick={() => changePaymentMethod("mobile")}
            >
              <div className="flex items-start w-full gap-4 px-4">
                <BsBank2 size={20} />
                <p>Mobile banking</p>
              </div>
            </Button>
          </div>
          <div className="flex flex-col gap-5 mt-10">
            <Button
              onClick={placeOrder}
              isLoading={isLoading}
              color="primary"
              radius="full"
              size="lg"
            >
              <p className="text-white">Place order</p>
            </Button>
            <Button
              color="primary"
              radius="full"
              variant="bordered"
              size="lg"
              startContent={<IoIosArrowRoundBack size={25} />}
              onClick={() => backToDelivery()}
            >
              <p>Back to delivery</p>
            </Button>
          </div>
        </div>

        <div>
          <Divider orientation="vertical" />
        </div>

        <div className="flex flex-col md:w-5/12 mt-20 md:mt-0">
          <div className="flex w-full justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-xl">Total price</h3>
              <p className="text-primary">Include delivery price</p>
            </div>
            <h3 className="font-bold text-xl">
              {formatNumberWithComma(
                calTotal(orderLines) + formData.delivery_price
              )}
            </h3>
          </div>
          <Divider className="my-4" />

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl">Delivery details</h3>
            <p>{formData.name}</p>
            <p className="my-2">{formData.address}</p>
            <p>{formData.phone_number}</p>
          </div>

          <Divider className="my-8" />

          <div className="flex justify-between font-bold text-lg">
            <h3>Delivery price</h3>
            <div>{formatNumberWithComma(formData.delivery_price)}</div>
          </div>

          <Divider className="my-8" />

          <p className="font-bold text-lg">Products</p>
          <div className="flex flex-col items-center">
            {orderLines.map((orderLine, index) => {
              return (
                <div key={index} className="my-5 w-full">
                  <CartCard orderLine={orderLine} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

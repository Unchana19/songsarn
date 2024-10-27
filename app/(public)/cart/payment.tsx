import { calTotal } from "@/utils/cal-total";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { FiTruck } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BsBank2 } from "react-icons/bs";
import { MdOutlinePayment, MdOutlineQrCodeScanner } from "react-icons/md";
import { Image } from "@nextui-org/image";
import { useState } from "react";
import { OrderLine } from "@/interfaces/order-line.interface";

interface Props {
  orderLines: OrderLine[]
  prevPage(page: number): void;
}

export default function PaymentPage({ orderLines, prevPage }: Props) {
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const deliveryCost = 500;

  const backToDelivery = () => {
    prevPage(2);
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
              color={paymentMethod === "mobile" ? "primary" : "default"}
              fullWidth
              size="lg"
              disableRipple
              onClick={() => setPaymentMethod("mobile")}
            >
              <div className="flex items-start w-full gap-4 px-4">
                <BsBank2 size={20} />
                <p>Mobile banking</p>
              </div>
            </Button>
            <Button
              variant="bordered"
              color={paymentMethod === "qr" ? "primary" : "default"}
              fullWidth
              size="lg"
              disableRipple
              onClick={() => setPaymentMethod("qr")}
            >
              <div className="flex items-start w-full gap-4 px-4">
                <MdOutlineQrCodeScanner size={20} />
                <p>Promptpay QR code</p>
              </div>
            </Button>
          </div>
          <div className="flex flex-col gap-5 mt-10">
            <Button color="primary" radius="full" size="lg">
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
              {formatNumberWithComma(calTotal(orderLines) + deliveryCost)}
            </h3>
          </div>
          <Divider className="my-4" />

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-xl">Delivery details</h3>
            <p>ธนบดี พิศรูป</p>
            <p className="my-2">
              มหาวิทยาลัยเกษตรศาสตร์ เลขที่ 50 ถนนงามวงศ์วาน แขวงลาดยาว
              เขตจตุจักร กรุงเทพฯ 10900.
            </p>
            <p>099-999-9999</p>
          </div>

          <Divider className="my-8" />

          <div className="flex justify-between font-bold text-lg">
            <h3>Delivery price</h3>
            <div>{formatNumberWithComma(deliveryCost)}</div>
          </div>

          <Divider className="my-8" />

          <p className="font-bold text-lg">orderLines</p>
          <div className="flex flex-col items-center">
            {orderLines.map((product) => {
              const isImage = product.type === "finished";

              return (
                <div className="my-5 w-full">
                  <div className="flex items-center gap-4">
                    {isImage && <Image src={product.image} width={100} />}

                    <div className="flex justify-between w-full">
                      <div className="flex flex-col">
                        <h3 className="font-bold">{product.name}</h3>
                        <div className="my-2 text-sm">
                          <p>{product.size}</p>
                          <p>
                            Price per unit{" "}
                            {formatNumberWithComma(product.price)}
                          </p>
                        </div>
                        <p className="text-sm">QTY. {product.amount}</p>
                      </div>

                      <h3 className="font-bold text-end">
                        {formatNumberWithComma(product.price * product.amount)}
                      </h3>
                    </div>
                  </div>
                  <Divider className="my-4" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

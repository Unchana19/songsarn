import type { OrderLine } from "@/interfaces/order-line.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { ButtonGroup, Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { RiDeleteBin5Line } from "react-icons/ri";
import ImagePlaceholder from "./image-placeholder";

interface Props {
  orderLine: OrderLine;
  userId?: string;
  accessToken?: string;
  handleIncreaseQuantityById?: (orderId: string) => void;
  handleDecreaseQuantityById?: (orderId: string) => void;
  handleDeleteOrderById?: (orderId: string) => void;
}

export default function CartCard({
  orderLine,
  handleIncreaseQuantityById,
  handleDecreaseQuantityById,
  handleDeleteOrderById,
}: Props) {
  return (
    <div>
      <div className="flex justify-evenly">
        <div className="w-4/12 flex justify-center px-1">
          {orderLine.img ? (
            <Image
              src={orderLine.img}
              height={150}
              width={250}
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder
              name={orderLine.name.slice(0, 4)}
              classNames={"w-full"}
            />
          )}
        </div>

        <div className="w-6/12 flex flex-col px-3 gap-5">
          <div>
            <p className="font-bold text-xl">{orderLine.name}</p>
          </div>
          <div>
            <p>Price per unit: {formatNumberWithComma(orderLine.price)}</p>
          </div>

          {handleIncreaseQuantityById &&
          handleDecreaseQuantityById &&
          handleDeleteOrderById ? (
            <div className="flex items-center gap-3">
              <div className="border-primary border-1.5 rounded-full p-1 w-48">
                <ButtonGroup className="flex justify-between">
                  <Button
                    onPress={() => handleDecreaseQuantityById(orderLine.id)}
                    isIconOnly
                    radius="full"
                    variant="light"
                    className="text-2xl"
                  >
                    -
                  </Button>
                  <div>{orderLine.quantity}</div>
                  <Button
                    onPress={() => handleIncreaseQuantityById(orderLine.id)}
                    isIconOnly
                    radius="full"
                    variant="light"
                    className="text-xl"
                  >
                    +
                  </Button>
                </ButtonGroup>
              </div>
              <Button
                onPress={() => handleDeleteOrderById(orderLine.id)}
                color="primary"
                variant="light"
                isIconOnly
                radius="full"
              >
                <RiDeleteBin5Line size={20} />
              </Button>
            </div>
          ) : (
            <div>
              <p>QTY: {orderLine.quantity}</p>
            </div>
          )}
        </div>

        <div className="w-2/12 flex flex-col justify-between items-end">
          <p className="font-bold text-lg">
            {formatNumberWithComma(orderLine.price * orderLine.quantity)}
          </p>
        </div>
      </div>
      <Divider className="my-10" />
    </div>
  );
}

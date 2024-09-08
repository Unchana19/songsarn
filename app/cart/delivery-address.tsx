import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { FiTruck } from "react-icons/fi";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { ProductFinished } from "../favorite/favorite-tab";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { calTotal } from "@/utils/cal-total";
import { Image } from "@nextui-org/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";

interface Props {
  products: ProductFinished[];
  prevPage(page: number): void;
  nextPage(page: number): void;
}

export default function DeliveryAddressPage({
  products,
  prevPage,
  nextPage,
}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const backToCart = () => {
    prevPage(1);
  };

  const continueToPayment = () => {
    nextPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-10 mb-20">
        <Button
          radius="full"
          isIconOnly
          className="p-10 opacity-100"
          color="primary"
          variant="light"
          isDisabled
        >
          <div className="flex flex-col items-center">
            <FiTruck size={25} />
            <p>Delivery</p>
          </div>
        </Button>
        <div className="bg-gray-600 h-1 w-1/5 rounded-full"></div>
        <Button
          radius="full"
          isIconOnly
          className="p-10 opacity-100"
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
          <div className="flex">
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-xl">Delivery address</h3>
              <p>ธนบดี พิศรูป</p>
              <p className="my-2">
                มหาวิทยาลัยเกษตรศาสตร์ เลขที่ 50 ถนนงามวงศ์วาน แขวงลาดยาว
                เขตจตุจักร กรุงเทพฯ 10900.
              </p>
              <p>099-999-9999</p>
            </div>
            <Button color="primary" radius="full" onPress={onOpen}>
              <p className="text-white">Edit</p>
            </Button>
          </div>
          <div className="flex flex-col gap-5">
            <Button
              color="primary"
              radius="full"
              size="lg"
              endContent={<IoIosArrowRoundForward size={25} color="white" />}
              onClick={() => continueToPayment()}
            >
              <p className="text-white">Continue to payment</p>
            </Button>
            <Button
              color="primary"
              radius="full"
              variant="bordered"
              size="lg"
              startContent={<IoIosArrowRoundBack size={25} />}
              onClick={() => backToCart()}
            >
              <p>Back to cart</p>
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
              <p>Not include delivery price</p>
            </div>
            <h3 className="font-bold text-xl">
              {formatNumberWithComma(calTotal(products))}
            </h3>
          </div>
          <Divider className="my-4" />
          <p className="font-bold text-lg">Products</p>
          <div className="flex flex-col items-center">
            {products.map((product) => {
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Default address
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  label="Full name"
                  placeholder="Full name"
                  labelPlacement="outside"
                />
                <Input
                  type="phone"
                  label="Phone number"
                  placeholder="Phone number"
                  labelPlacement="outside"
                />
                <Input
                  type="text"
                  label="Address"
                  placeholder="Address"
                  labelPlacement="outside"
                />
                <Input
                  type="text"
                  label="Address line 2 (Optional)"
                  placeholder="Address line 2 (Optional)"
                  labelPlacement="outside"
                />
                <Input
                  type="text"
                  label="Province"
                  placeholder="Province"
                  labelPlacement="outside"
                />
                <Input
                  type="text"
                  label="Zip code"
                  placeholder="Zip code"
                  labelPlacement="outside"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onClose}
                  radius="full"
                  fullWidth
                >
                  <p className="text-white">Save and use this address</p>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

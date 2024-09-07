import { ProductFinished } from "@/app/favorite/favorite-tab";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { FaCartPlus } from "react-icons/fa";

interface Props {
  product: ProductFinished;
  isImage?: boolean;
}

export default function CartCardComponent({ product, isImage }: Props) {
  return (
    <div>
      <div className="flex items-center justify-evenly">
        {isImage && (
          <div>
            <Image src={product.image} width={200} />
          </div>
        )}
        <div className={`flex flex-col gap-4 ${isImage ? "w-2/3" : "w-full"}`}>
          <div className="flex flex-col md:flex-row md:justify-between">
            <h3 className="font-bold text-lg">
              {isImage ? product.name : `Custom order no.${product.id}`}
            </h3>
            <h3 className="font-bold text-lg">
              {formatNumberWithComma(product.price)}
            </h3>
          </div>
          <p>{isImage ? product.size : product.name}</p>
          <div className="flex gap-4">
            <div className="flex border-2 border-primary rounded-3xl items-center gap-2">
              <Button isIconOnly variant="light" radius="full">
                <p className="text-xl">-</p>
              </Button>
              <p className="px-3">{product.amount}</p>
              <Button isIconOnly variant="light" radius="full">
                <p>+</p>
              </Button>
            </div>
            <Button isIconOnly color="primary" radius="full">
              <FaCartPlus color="white" size={20} />
            </Button>
            {!isImage && (
              <Button color="primary" radius="full">
                <p className="text-white">Detail</p>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Divider className={`${isImage ? "my-10" : "my-20"}`} />
    </div>
  );
}

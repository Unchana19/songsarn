import CartCardComponent from "@/components/cart-card";
import { calTotal } from "@/utils/cal-total";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { MdOutlinePayments } from "react-icons/md";
import { ProductFinished } from "../favorite/favorite-tab";

interface Props {
  products: ProductFinished[];
  nextPage(page: number): void;
}

export default function CartSummaryPage({ products, nextPage }: Props) {
  const goToCheckOut = () => {
    nextPage(0);
  };
  return (
    <div>
      <h3 className="font-bold text-xl mb-5">Your cart</h3>
      <div className="flex flex-col md:flex-row w-full">
        <div className="md:w-1/2">
          <div>
            {products.map((product: ProductFinished) => {
              const isImage = product.type === "finished";
              return (
                <CartCardComponent
                  key={product.id}
                  product={product}
                  isImage={isImage}
                />
              );
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
                size="lg"
                startContent={<MdOutlinePayments color="white" size={20} />}
                onClick={() => goToCheckOut()}
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

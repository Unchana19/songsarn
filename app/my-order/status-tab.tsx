import TabsSelect from "@/components/tabs-select";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useTransition } from "react";

export interface OrderStatus {
  id: string;
  paymentStatus: string;
  quantity: number;
  price: number;
  stataus: string;
}

interface Props {
  orderStatus: OrderStatus[];
}

export default function StatusTab({ orderStatus }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "process", label: "On processing" },
    { id: "completed", label: "Completed" },
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
      <h3 className="font-bold text-xl mb-5">My orders</h3>
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="bordered"
      />

      <div>
        {tabs.map((tab) => {
          const isSelected = searchParams.get("type") === tab.id;
          return isSelected ? (
            <div>
              {orderStatus.length > 0 ? (
                <div className="my-5 flex flex-col gap-10">
                  {orderStatus.map((order) => (
                    <div className="flex flex-col md:flex-row md:justify-around border-1 border-primary rounded-3xl p-5 gap-5">
                      <div className="flex flex-col">
                        <p className="font-bold text-lg mb-1">
                          Order no.{order.id}
                        </p>
                        <p>
                          Payment status:{" "}
                          <span className="text-success">
                            {order.paymentStatus}
                          </span>
                        </p>
                        <p>Quantity: {order.quantity}</p>
                        <p>
                          Total amount(Baht):{" "}
                          {formatNumberWithComma(order.price)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p>
                          Status:{" "}
                          <span className="text-primary">{order.stataus}</span>
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <Button color="primary" className="rounded-3xl px-10">
                          <p className="text-white">Detail</p>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No order for this filter</div>
              )}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

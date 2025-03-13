import EmptyComponents from "@/components/empty-components";
import TabsSelect from "@/components/tabs-select";
import type { CPOGetAll } from "@/interfaces/cpo-get-all.interface";
import { formatId } from "@/utils/format-id";
import { getStatusCpo } from "@/utils/get-status-cpo";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Key, useTransition, useMemo } from "react";

interface Props {
  cpos: CPOGetAll[];
  isSuccess: boolean;
}

export default function StatusTab({ cpos, isSuccess }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "process", label: "On processing" },
    { id: "completed", label: "Completed" },
  ];

  const filteredCPOs = useMemo(() => {
    const currentTab = searchParams.get("type") || "process";
    return cpos.filter((cpo) => {
      if (currentTab === "process") {
        return ["NEW", "PAID", "PROCESSING", "ON DELIVERY"].includes(
          cpo.status
        );
      }
      return ["COMPLETED", "CANCELED"].includes(cpo.status);
    });
  }, [cpos, searchParams]);

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
        size="lg"
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="bordered"
      />

      <div>
        {tabs.map((tab) => {
          const isSelected = searchParams.get("type") === tab.id;
          return isSelected ? (
            <div key={tab.id}>
              {isSuccess && filteredCPOs.length > 0 ? (
                <div className="my-5 flex flex-col gap-5">
                  {filteredCPOs.map((order) => (
                    <Link
                      href={`/my-order/detail/${order.id}`}
                      key={order.id}
                      className="flex flex-col md:flex-row md:justify-between border-1 border-primary/30 hover:border-primary transition-colors duration-200 rounded-3xl p-5 gap-5"
                    >
                      <div className="flex flex-col">
                        <p className="font-bold text-lg mb-1 font-mono">
                          {formatId("CPO", order.id)}
                        </p>
                        <div className="space-y-2">
                          <p className="flex items-center gap-2">
                            Payment status:{" "}
                            <Chip
                              variant="flat"
                              color={
                                order.status.toLowerCase() === "completed"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {order.status.toLowerCase() === "completed"
                                ? "Fully paid"
                                : order.paid_date_time
                                  ? "Deposit paid"
                                  : "Not deposit paid"}
                            </Chip>
                          </p>
                          <p>Quantity: {order.quantity}</p>
                          <p className="font-medium">
                            Total amount:{" "}
                            <span className="text-primary">
                              {formatNumberWithComma(order.total_price)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="flex items-center gap-2">
                          Status:{" "}
                          <Chip variant="flat" color="primary">
                            {getStatusCpo(order.status)}
                          </Chip>
                        </p>
                      </div>
                      <div className="flex items-center justify-center">
                        <Button
                          color="primary"
                          className="rounded-full px-10 font-medium text-white"
                        >
                          Detail
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-10">
                  <EmptyComponents
                    title={`No ${tab.id === "process" ? "processing" : "completed"} orders`}
                    subTitle={
                      tab.id === "process"
                        ? "You don't have any orders being processed at the moment"
                        : "You haven't completed any orders yet"
                    }
                  />
                </div>
              )}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

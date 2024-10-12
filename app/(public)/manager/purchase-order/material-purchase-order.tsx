"use client";

import TabsSelect from "@/components/tabs-select";
import { MPOGetAll } from "@/interfaces/mpo-get-all.interface";
import { convertTimestampToDate } from "@/utils/convert-timestamp";
import { getStatusMpo } from "@/utils/get-status-mpo";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useState, useTransition } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Props {
  mpo: MPOGetAll[] | null;
}

export default function MaterialPurchaseOrder({ mpo }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const [mpoFilter, setMpoFilter] = useState<MPOGetAll[] | null | undefined>(
    null
  );

  const filterMpo = (status: string) => {
    setMpoFilter(mpo?.filter((m) => m.status === status));
  };

  const tabs = [
    { id: "waiting", label: "Waiting" },
    { id: "received", label: "Received" },
  ];

  const handleTabChange = (key: Key) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("status", key.toString());
      if (key.toString() === "waiting") {
        filterMpo("NEW");
      } else if (key.toString() === "received") {
        filterMpo("RECEIVED");
      }
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div>
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="solid"
        size={"md"}
      />

      <div>
        {tabs.map((tab) => {
          const isSelected = searchParams.get("status") === tab.id;
          return isSelected ? (
            <div className="flex flex-col gap-5 mt-5">
              {mpoFilter?.map((mpo) => (
                <div className="border-primary border-1 p-1 py-5 flex flex-col md:flex-row rounded-xl gap-5 md:gap-0">
                  <div className="flex w-full md:w-4/12 items-center justify-center">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-bold">{mpo.supplier}</p>
                      <p>
                        Purchase date:{" "}
                        {convertTimestampToDate(mpo.create_date_time)}
                      </p>
                      <p>
                        Total amount(Baht){" "}
                        {mpo.total_amount
                          ? formatNumberWithComma(mpo.total_amount)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full md:w-4/12 items-center justify-center">
                    <div className="flex flex-col gap-1">
                      <p>
                        Status:{" "}
                        <span className="text-primary">
                          {getStatusMpo(mpo.status)}
                        </span>{" "}
                      </p>
                      <p>
                        Receive date and time:{" "}
                        {mpo.receive_date_time
                          ? convertTimestampToDate(mpo.receive_date_time)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full md:w-2/12 items-center justify-center">
                    <div className="flex flex-col gap-3">
                      <Button
                        as={Link}
                        href={`/manager/purchase-order/detail/${mpo.id}`}
                        size="lg"
                        color="primary"
                        radius="full"
                        className="text-white"
                      >
                        <p>Detail</p>
                      </Button>
                      <Button
                        size="lg"
                        color="primary"
                        radius="full"
                        variant="bordered"
                        className="text-black"
                      >
                        <p>Receive</p>
                        <FaArrowRightLong />
                      </Button>
                    </div>
                  </div>

                  <div className="flex w-full md:w-1/12 items-center justify-center">
                    <div className="flex flex-col">
                      <Button
                        size="lg"
                        isIconOnly
                        color="primary"
                        variant="light"
                      >
                        <RiDeleteBin5Line size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

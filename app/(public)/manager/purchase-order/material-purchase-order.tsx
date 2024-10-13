"use client";

import PopupModal from "@/components/popup-modal";
import TabsSelect from "@/components/tabs-select";
import { MPOGetAll } from "@/interfaces/mpo-get-all.interface";
import { convertTimestampToDate } from "@/utils/convert-timestamp";
import { getStatusMpo } from "@/utils/get-status-mpo";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/modal";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useEffect, useState, useTransition } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";

interface Props {
  mpo: MPOGetAll[] | null;
  fetchMPO: () => void;
}

export default function MaterialPurchaseOrder({ mpo, fetchMPO }: Props) {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const [mpoFilter, setMpoFilter] = useState<MPOGetAll[] | null | undefined>(
    null
  );

  const [mpoId, setMpoId] = useState("");
  const cancelModal = useDisclosure();
  const receiveModal = useDisclosure();

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

  const handleReceieve = (id: string) => {
    setMpoId(id);
    receiveModal.onOpen();
  };

  const handleReceieveConfirm = async () => {
    try {
      const response = await fetch("/api/material-purchase-orders/receive", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify({ id: mpoId }),
      });
      const result = await response.json();
      if (response.ok) {
        await fetchMPO();
        filterMpo(searchParams.get("status") || "waiting");
        receiveModal.onOpenChange();
        router.refresh();
      } else {
        receiveModal.onOpenChange();
      }
    } catch (error) {}
  };

  const handleCancel = (id: string) => {
    setMpoId(id);
    cancelModal.onOpen();
  };

  const handleCancelConfirm = async () => {
    try {
      const response = await fetch("/api/material-purchase-orders/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify({ id: mpoId }),
      });
      const result = await response.json();
      if (response.ok) {
        await fetchMPO();
        filterMpo(searchParams.get("status") || "waiting");
        cancelModal.onOpenChange();
        router.refresh();
      } else {
        cancelModal.onOpenChange();
      }
    } catch (error) {}
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
                        {mpo.total_price
                          ? formatNumberWithComma(mpo.total_price)
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
                        color="primary"
                        radius="full"
                        className="text-white"
                      >
                        <p>Detail</p>
                      </Button>
                      {tab.id === "waiting" ? (
                        <Button
                          onClick={() => handleReceieve(mpo.id)}
                          color="primary"
                          radius="full"
                          variant="bordered"
                          className="text-black"
                        >
                          <p>Receive</p>
                          <FaArrowRightLong />
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex w-full md:w-1/12 items-center justify-center">
                    <div className="flex flex-col">
                      <Button
                        onClick={() => handleCancel(mpo.id)}
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
      <PopupModal
        message={"Are you sure to cancel order"}
        isOpen={cancelModal.isOpen}
        onClose={cancelModal.onOpenChange}
        buttonTitle="Confirm"
        buttonFunction={handleCancelConfirm}
      />
      <PopupModal
        message={"Are you sure to receive order"}
        isOpen={receiveModal.isOpen}
        onClose={receiveModal.onOpenChange}
        buttonTitle="Confirm"
        buttonFunction={handleReceieveConfirm}
      />
    </div>
  );
}

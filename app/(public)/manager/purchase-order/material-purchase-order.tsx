"use client";

import TabsSelect from "@/components/tabs-select";
import { MPOGetAll } from "@/interfaces/mpo-get-all.interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useTransition, useMemo, useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import EmptyComponents from "@/components/empty-components";
import { formatId } from "@/utils/format-id";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { getStatusMpo } from "@/utils/get-status-mpo";
import { convertTimestampToDate } from "@/utils/convert-timestamp";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PopupModal from "@/components/popup-modal";
import { useDisclosure } from "@nextui-org/modal";

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
  const [mpoId, setMpoId] = useState("");
  const [message, setMessage] = useState("");
  const [currentTab, setCurrentTab] = useState("waiting");
  const cancelModal = useDisclosure();
  const receiveModal = useDisclosure();

  const tabs = [
    { id: "waiting", label: "Waiting" },
    { id: "received", label: "Received" },
  ];

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) {
      setCurrentTab(status);
    }
  }, [searchParams]);

  const filteredMPOs = useMemo(() => {
    if (!mpo) return [];
    return mpo.filter((order) => {
      switch (currentTab) {
        case "waiting":
          return order.status === "NEW";
        case "received":
          return order.status === "RECEIVED";
        default:
          return false;
      }
    });
  }, [mpo, currentTab]);

  const handleTabChange = (key: Key) => {
    const newTab = key.toString();
    setCurrentTab(newTab);
    startTransition(() => {
      router.push(`${pathname}?type=material&status=${newTab}`);
    });
  };

  const handleReceieve = async (id: string) => {
    try {
      const response = await fetch("/api/material-purchase-orders/receive", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (response.ok) {
        await fetchMPO();
        receiveModal.onClose();
        router.push("/manager/purchase-order?type=material&status=received");
      }
    } catch (error) {}
  };

  const handleCancel = async (id: string) => {
    try {
      const response = await fetch("/api/material-purchase-orders/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (response.ok) {
        await fetchMPO();
        cancelModal.onClose();
      }
    } catch (error) {}
  };

  const handleAction = (id: string, action: string) => {
    setMpoId(id);
    setMessage(action);
    if (action === "receive") {
      receiveModal.onOpen();
    } else if (action === "cancel") {
      cancelModal.onOpen();
    }
  };

  const handleActionConfirm = () => {
    switch (message) {
      case "receive":
        return handleReceieve(mpoId);
      case "cancel":
        return handleCancel(mpoId);
      default:
        return;
    }
  };

  return (
    <div>
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="solid"
        size="md"
        selectedKey={currentTab}
      />

      <div>
        {tabs.map((tab) => {
          const isSelected = currentTab === tab.id;
          return isSelected ? (
            <div key={tab.id} className="flex flex-col gap-5 mt-5">
              {filteredMPOs.length > 0 ? (
                filteredMPOs.map((order) => (
                  <Link
                    href={`/manager/purchase-order/detail/mpo/${order.id}`}
                    key={order.id}
                    className="border-1 border-primary/30 hover:border-primary rounded-2xl p-5"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-5">
                      <div className="space-y-2">
                        <p className="font-bold font-mono">
                          {formatId("MPO", order.id)}
                        </p>
                        <p className="font-medium">
                          Supplier: {order.supplier}
                        </p>
                        <p>
                          Purchase date:{" "}
                          {convertTimestampToDate(order.create_date_time)}
                        </p>
                        <p className="font-medium">
                          Total amount:{" "}
                          <span className="text-primary">
                            {formatNumberWithComma(order.total_price || 0)}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="space-y-6">
                          <p className="flex items-center gap-2">
                            Order status:{" "}
                            <Chip variant="flat" color="primary">
                              {getStatusMpo(order.status)}
                            </Chip>
                          </p>
                          <p>
                            Receive date:{" "}
                            {order.receive_date_time
                              ? convertTimestampToDate(order.receive_date_time)
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center w-full md:w-1/6">
                        <div className="flex flex-col gap-2">
                          <Button
                            color="primary"
                            className="rounded-full font-medium text-white"
                          >
                            Detail
                          </Button>
                          {currentTab === "waiting" && (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAction(order.id, "receive");
                              }}
                              color="primary"
                              variant="bordered"
                              className="rounded-full font-medium flex items-center"
                            >
                              Receive
                              <FaArrowRightLong />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center w-full md:w-1/12">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAction(order.id, "cancel");
                          }}
                          color="primary"
                          variant="light"
                          isIconOnly
                          className="rounded-full"
                        >
                          <RiDeleteBin5Line size={20} />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <EmptyComponents
                  title={`No ${tab.label.toLowerCase()} orders`}
                  subTitle="There are no orders in this status"
                />
              )}
            </div>
          ) : null;
        })}
      </div>

      <PopupModal
        message={`Are you sure to ${message} order`}
        isOpen={
          message === "receive" ? receiveModal.isOpen : cancelModal.isOpen
        }
        onClose={
          message === "receive"
            ? receiveModal.onOpenChange
            : cancelModal.onOpenChange
        }
        buttonTitle="Confirm"
        buttonFunction={handleActionConfirm}
      />
    </div>
  );
}

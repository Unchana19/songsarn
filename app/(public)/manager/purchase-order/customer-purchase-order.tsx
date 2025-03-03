"use client";

import TabsSelect from "@/components/tabs-select";
import type { ManagerCPOGetAll } from "@/interfaces/manager-cpo-get-all.interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Key, useTransition, useMemo, useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import EmptyComponents from "@/components/empty-components";
import { formatId } from "@/utils/format-id";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { getStatusCpo } from "@/utils/get-status-cpo";
import { convertTimestampToDate } from "@/utils/convert-timestamp";
import { FaArrowRightLong } from "react-icons/fa6";
import { getDateLabelCPO } from "@/utils/get-date-label-cpo";
import { getActionButtonCPO } from "@/utils/get-action-button-cpo";
import Link from "next/link";
import { getCPOMaterialStatus } from "@/utils/get-cpo-material-stataus";
import { useSession } from "next-auth/react";
import PopupModal from "@/components/popup-modal";
import { useDisclosure } from "@heroui/modal";
import {
  useCompletedCPOMutation,
  useDeliveryCPOMutation,
  useFinishedProcessCPOMutation,
  useProcessCPOMutation,
} from "@/store";
import { toastSuccess } from "@/utils/toast-config";

interface Props {
  cpos: ManagerCPOGetAll[];
}

export default function CustomerPurchaseOrder({ cpos }: Props) {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [cpoId, setCPOId] = useState("");
  const [message, setMessage] = useState("");
  const actionModal = useDisclosure();
  const [currentTab, setCurrentTab] = useState("paid");

  const [processCPO, resultsProcessCPO] = useProcessCPOMutation();
  const [finishedProcessCPO, resultsFinishedProcessCPO] =
    useFinishedProcessCPOMutation();
  const [deliveryCPO, resultsDeliveryCPO] = useDeliveryCPOMutation();
  const [completedCPO, resultsCompletedCPO] = useCompletedCPOMutation();

  const tabs = [
    { id: "paid", label: "Paid" },
    { id: "in-process", label: "In process" },
    { id: "ready-to-delivery", label: "Ready to delivery" },
    { id: "on-delivery", label: "On delivery" },
    { id: "completed", label: "Completed" },
  ];

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) {
      setCurrentTab(status);
    }
  }, [searchParams]);

  const filteredCPOs = useMemo(() => {
    return cpos.filter((cpo) => {
      switch (currentTab) {
        case "paid":
          return cpo.status === "PAID";
        case "in-process":
          return cpo.status === "PROCESSING";
        case "ready-to-delivery":
          return cpo.status === "FINISHED PROCESS";
        case "on-delivery":
          return cpo.status === "ON DELIVERY";
        case "completed":
          return cpo.status === "COMPLETED";
        default:
          return false;
      }
    });
  }, [cpos, currentTab]);

  const handleTabChange = (key: Key) => {
    const newTab = key.toString();
    setCurrentTab(newTab);
    startTransition(() => {
      router.push(`${pathname}?type=customer&status=${newTab}`);
    });
  };

  const handleProcessCPO = async (id: string) => {
    await processCPO({ id, accessToken: session.data?.accessToken || "" });

    actionModal.onClose();
    toastSuccess("Update order status successfully");
    router.push("/manager/purchase-order?type=customer&status=in-process");
  };

  const handleFinishedProcessCPO = async (id: string) => {
    await finishedProcessCPO({
      id,
      accessToken: session.data?.accessToken || "",
    });

    actionModal.onClose();
    toastSuccess("Update order status successfully");
    router.push(
      "/manager/purchase-order?type=customer&status=ready-to-delivery"
    );
  };

  const handleDeliveryCPO = async (id: string) => {
    await deliveryCPO({ id, accessToken: session.data?.accessToken || "" });

    actionModal.onClose();
    toastSuccess("Update order status successfully");
    router.push("/manager/purchase-order?type=customer&status=on-delivery");
  };

  const handleCompletedCPO = async (id: string) => {
    await completedCPO({
      id,
      accessToken: session.data?.accessToken || "",
    });

    actionModal.onClose();
    toastSuccess("Update order status successfully");
    router.push("/manager/purchase-order?type=customer&status=completed");
  };

  const handleActionConfirm = () => {
    switch (message) {
      case "process":
        return handleProcessCPO(cpoId);
      case "finished process":
        return handleFinishedProcessCPO(cpoId);
      case "delivery":
        return handleDeliveryCPO(cpoId);
      case "completed":
        return handleCompletedCPO(cpoId);
      default:
        return;
    }
  };

  const handleAction = (id: string) => {
    setCPOId(id);
    actionModal.onOpen();
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
              {filteredCPOs.length > 0 ? (
                filteredCPOs.map((order) => (
                  <Link
                    href={`/manager/purchase-order/detail/cpo/${order.id}`}
                    key={order.id}
                    className="border-1 border-primary/30 hover:border-primary rounded-2xl p-5"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-5">
                      <div className="space-y-2">
                        <p className="font-bold font-mono">
                          {formatId("CPO", order.id)}
                        </p>
                        <p className="flex items-center gap-2">
                          Payment status:{" "}
                          <Chip
                            variant="flat"
                            color={
                              order.status.toLocaleLowerCase() === "completed"
                                ? "success"
                                : "warning"
                            }
                          >
                            {order.status.toLocaleLowerCase() === "completed"
                              ? "Fully paid"
                              : order.paid_date_time
                                ? "Deposit paid"
                                : "Not deposit paid"}
                          </Chip>
                        </p>
                        <p>Buyer: {order.user_name}</p>
                        <p>
                          {getDateLabelCPO(order.status)}:{" "}
                          {convertTimestampToDate(order.last_updated)}
                        </p>
                        <p className="font-medium">
                          Total amount:{" "}
                          <span className="text-primary">
                            {formatNumberWithComma(order.total_price)}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="space-y-6">
                          <p className="flex items-center gap-2">
                            Order status:{" "}
                            <Chip variant="flat" color="primary">
                              {getStatusCpo(order.status)}
                            </Chip>
                          </p>
                          <p>Delivery date: {order.est_delivery_date}</p>
                          {order.material_status && (
                            <div>
                              <p className="flex items-center gap-2">
                                Material status:{" "}
                                <Chip
                                  variant="flat"
                                  color={
                                    getCPOMaterialStatus(order.material_status)
                                      .color as "success" | "warning" | "danger"
                                  }
                                >
                                  {
                                    getCPOMaterialStatus(order.material_status)
                                      .label as string
                                  }
                                </Chip>
                              </p>
                              {order.material_status ===
                                "insufficient_materials" &&
                                order.material_details && (
                                  <div className="mt-3 bg-danger-50/30 rounded-xl p-4">
                                    <h4 className="text-sm font-medium text-danger mb-3">
                                      Insufficient Materials:
                                    </h4>
                                    <div className="space-y-3">
                                      {order.material_details
                                        .filter(
                                          (detail) =>
                                            detail.needed > detail.available
                                        )
                                        .map((detail) => (
                                          <div
                                            key={detail.material_name}
                                            className="bg-white/60 rounded-lg p-3 border border-danger-100"
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <p className="font-medium">
                                                {detail.material_name}
                                              </p>
                                              <Chip
                                                size="sm"
                                                variant="flat"
                                                color="danger"
                                                className="font-medium"
                                              >
                                                Shortage:{" "}
                                                {(
                                                  detail.needed -
                                                  detail.available
                                                ).toLocaleString()}
                                              </Chip>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div className="bg-danger-50/30 rounded-lg px-3 py-2">
                                                <p className="text-xs text-default-500 mb-1">
                                                  Available
                                                </p>
                                                <p className="font-medium">
                                                  {detail.available.toLocaleString()}
                                                </p>
                                              </div>
                                              <div className="bg-danger-50/30 rounded-lg px-3 py-2">
                                                <p className="text-xs text-default-500 mb-1">
                                                  Needed
                                                </p>
                                                <p className="font-medium">
                                                  {detail.needed.toLocaleString()}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center w-full md:w-1/6">
                        <div className="flex flex-col gap-2">
                          <Button
                            isDisabled
                            color="primary"
                            className="rounded-full font-medium text-white opacity-100"
                          >
                            Detail
                          </Button>
                          {currentTab !== "completed" && (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMessage(
                                  getActionButtonCPO(
                                    order.status
                                  ).toLocaleLowerCase()
                                );
                                handleAction(order.id);
                              }}
                              color="primary"
                              variant="bordered"
                              className="rounded-full font-medium flex items-center"
                              isLoading={
                                resultsProcessCPO.isLoading ||
                                resultsFinishedProcessCPO.isLoading ||
                                resultsDeliveryCPO.isLoading ||
                                resultsCompletedCPO.isLoading
                              }
                              isDisabled={
                                order.status === "PAID" &&
                                order.material_status ===
                                  "insufficient_materials"
                              }
                            >
                              {getActionButtonCPO(order.status)}
                              <FaArrowRightLong />
                            </Button>
                          )}
                        </div>
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
        isOpen={actionModal.isOpen}
        onClose={actionModal.onOpenChange}
        buttonTitle="Confirm"
        buttonFunction={handleActionConfirm}
      />
    </div>
  );
}

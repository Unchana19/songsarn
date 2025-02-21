"use client";

import { Suspense } from "react";
import TabsSelect from "@/components/tabs-select";
import { Skeleton } from "@heroui/skeleton";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { type Key, useTransition } from "react";
import CustomerPurchaseOrder from "./customer-purchase-order";
import MaterialPurchaseOrder from "./material-purchase-order";
import { useSession } from "next-auth/react";
import { useFetchCPOByManagerQuery, useFetchMPOsQuery } from "@/store";

function PurchaseOrderContent() {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    currentData: mpo,
    isLoading: isLoadingMPO,
    isSuccess: isSuccessMPO,
  } = useFetchMPOsQuery(session.data?.accessToken || "");

  const {
    currentData: cpo,
    isLoading: isLoadingCPO,
    isSuccess: isSuccessCPO,
  } = useFetchCPOByManagerQuery(session.data?.accessToken || "");

  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "customer", label: "Customer" },
    { id: "material", label: "Material" },
  ];

  const handleTabChange = (key: Key) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const getStepContent = (label: string) => {
    switch (label) {
      case "Customer":
        return isLoadingCPO || !isSuccessCPO ? (
          <SkeletonLoading />
        ) : (
          <CustomerPurchaseOrder cpos={cpo} />
        );

      case "Material":
        return isLoadingMPO || !isSuccessMPO ? (
          <SkeletonLoading />
        ) : (
          <MaterialPurchaseOrder mpo={mpo} />
        );

      default:
        return "unknown label";
    }
  };

  return (
    <div className="mb-40 w-full">
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="bordered"
        size="lg"
      />

      <div>
        {tabs.map((tab) => {
          const isSelected = searchParams.get("type") === tab.id;
          return isSelected ? (
            <div key={tab.id} className="mt-5">
              {getStepContent(tab.label)}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

function SkeletonLoading() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function PurchaseOrderTab() {
  return (
    <Suspense fallback={<SkeletonLoading />}>
      <PurchaseOrderContent />
    </Suspense>
  );
}

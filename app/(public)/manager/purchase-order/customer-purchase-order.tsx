import TabsSelect from "@/components/tabs-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useTransition } from "react";

export default function CustomerPurchaseOrder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "paid", label: "Paid" },
    { id: "in-process", label: "In process" },
    { id: "ready-to-delivery", label: "Ready to delivery" },
    { id: "on-delivery", label: "On delivery" }, 
    { id: "completed", label: "Completed" }, 
  ];

  const handleTabChange = (key: Key) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("status", key.toString());
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
    </div>
  );
}

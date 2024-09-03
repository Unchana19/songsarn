"use client";

import { order } from "@/data/order";
import StatusTab from "./status-tab";

interface Props {
  searchParams: { type: string };
}

export default function MyOrderPage({ searchParams }: Props) {
  const orderProcess = order.filter((o) => o.stataus !== "Completed");
  const orderSuccess = order.filter((o) => o.stataus === "Completed");

  return (
    <div>
      <StatusTab
        orderStatus={
          searchParams.type === "completed" ? orderSuccess : orderProcess
        }
      />
    </div>
  );
}

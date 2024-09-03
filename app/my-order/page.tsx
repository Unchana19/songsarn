"use client";

import StatusTab from "./status-tab";

const order = [
  {
    id: "001",
    paymentStatus: "Completed",
    quantity: 1,
    price: 45000,
    stataus: "In the production",
  },
  {
    id: "002",
    paymentStatus: "Completed",
    quantity: 1,
    price: 45000,
    stataus: "Ready to delivery",
  },
  {
    id: "003",
    paymentStatus: "Completed",
    quantity: 1,
    price: 45000,
    stataus: "Completed",
  },
  {
    id: "004",
    paymentStatus: "Completed",
    quantity: 1,
    price: 45000,
    stataus: "Completed",
  },
];

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

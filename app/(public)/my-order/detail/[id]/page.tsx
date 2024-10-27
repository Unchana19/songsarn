"use client";

import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams();
  return (
    <div>
      <p className="font-bold text-xl">Order detail</p>
    </div>
  );
}

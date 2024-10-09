"use client";

import { cpoHistory, mpoHistory } from "@/data/histories";
import HistoryTab from "./history-tab";

interface Props {
  searchParams: { type: string };
}

export default function HistoryPage({ searchParams }: Props) {
  let histories;
  if (searchParams.type === "customer" || undefined) {
    histories = cpoHistory;
  } else {
    histories = mpoHistory;
  }
  return (
    <div>
      <HistoryTab histories={histories} />
    </div>
  );
}

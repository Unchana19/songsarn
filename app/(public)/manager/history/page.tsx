"use client";

import type { History } from "@/interfaces/history.interface";
import HistoryTab from "./history-tab";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useFetchHistoriesQuery } from "@/store";
import Loading from "@/app/loading";

interface Props {
  searchParams: { type: string };
}

export default function HistoryPage({ searchParams }: Props) {
  const session = useSession();

  const {
    currentData: histories = [],
    isLoading,
  } = useFetchHistoriesQuery(session.data?.accessToken || "");

  const filteredHistory = useMemo(() => {
    return histories.filter((history: History) => {
      switch (searchParams.type) {
        case "material":
          return history.type === "MPO";
        default:
          return history.type === "CPO";
      }
    });
  }, [histories, searchParams.type]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <HistoryTab histories={filteredHistory} isLoading={isLoading} />
    </div>
  );
}

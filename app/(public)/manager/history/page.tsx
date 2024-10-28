"use client";

import { History } from "@/interfaces/history.interface";
import HistoryTab from "./history-tab";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  searchParams: { type: string };
}

export default function HistoryPage({ searchParams }: Props) {
  const session = useSession();
  const [histories, setHistories] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredHistory = useMemo(() => {
    return histories.filter((history) => {
      switch (searchParams.type) {
        case "customer":
          return history.type === "CPO";
        case "material":
          return history.type === "MPO";
        default:
          return false;
      }
    });
  }, [histories, searchParams.type]);

  const fetchHistories = async () => {
    try {
      const token = session.data?.accessToken;
      const response = await fetch("/api/history", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setHistories(result);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, [session]);

  return (
    <div>
      <HistoryTab histories={filteredHistory} isLoading={isLoading} />
    </div>
  );
}

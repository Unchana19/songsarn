"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Transaction } from "@/interfaces/transaction.interface";
import TransactionTab from "./transaction-tap";

interface Props {
  searchParams: { type: string };
}

export default function TransactionPage({ searchParams }: Props) {
  const session = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      switch (searchParams.type) {
        case "material":
          return transaction.type === "mpo";
        default:
          return transaction.type === "cpo";
      }
    });
  }, [transactions, searchParams.type]);

  const fetchTransactions = async () => {
    try {
      const token = session.data?.accessToken;
      const response = await fetch("/api/transactions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setTransactions(result);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [session]);

  return (
    <div>
      <TransactionTab
        transactions={filteredTransactions}
        isLoading={isLoading}
      />
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import type { Transaction } from "@/interfaces/transaction.interface";
import TransactionTab from "./transaction-tap";
import { useFetchTransactionsQuery } from "@/store";

interface Props {
  searchParams: { type: string };
}

export default function TransactionPage({ searchParams }: Props) {
  const session = useSession();

  const { data: transactions = [], isLoading } = useFetchTransactionsQuery(
    session.data?.accessToken || ""
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction: Transaction) => {
      switch (searchParams.type) {
        case "material":
          return transaction.type === "mpo";
        default:
          return transaction.type === "cpo";
      }
    });
  }, [transactions, searchParams.type]);

  return (
    <div>
      <TransactionTab
        transactions={filteredTransactions}
        isLoading={isLoading}
      />
    </div>
  );
}

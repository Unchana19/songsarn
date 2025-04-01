"use client";

import { useMemo, use } from "react";
import { useSession } from "next-auth/react";
import type { Transaction } from "@/interfaces/transaction.interface";
import TransactionTab from "./transaction-tap";
import { useFetchTransactionsQuery } from "@/store";
import Loading from "@/app/loading";

interface Props {
  searchParams: Promise<{ type: string }>;
}

export default function TransactionPage(props: Props) {
  const searchParams = use(props.searchParams);
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <TransactionTab
        transactions={filteredTransactions}
        isLoading={isLoading}
      />
    </div>
  );
}

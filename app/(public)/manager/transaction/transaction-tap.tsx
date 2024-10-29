"use client";

import TabsSelect from "@/components/tabs-select";
import { usePathname, useRouter } from "next/navigation";
import { Key, useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { Chip } from "@nextui-org/chip";
import { Skeleton } from "@nextui-org/skeleton";
import {
  TableRow,
  TableCell,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
} from "@nextui-org/table";
import { formatId } from "@/utils/format-id";
import { Transaction } from "@/interfaces/transaction.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { getPaymentMethod } from "@/utils/get-payment-method";
import Link from "next/link";
interface Props {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function TransactionTab({ transactions, isLoading }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [currentTab, setCurrentTab] = useState("customer");

  const tabs = [
    { id: "customer", label: "Customer" },
    { id: "material", label: "Material" },
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      switch (currentTab) {
        case "customer":
          return transaction.type === "cpo";
        case "material":
          return transaction.type === "mpo";
        default:
          return false;
      }
    });
  }, [transactions, currentTab]);

  const handleTabChange = (key: Key) => {
    const newTab = key.toString();
    setCurrentTab(newTab);
    startTransition(() => {
      router.push(`${pathname}?type=${newTab}`);
    });
  };

  const getStatusColor = (
    status: string
  ): "success" | "primary" | "secondary" | "warning" | "danger" => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "in process":
        return "primary";
      case "ready to delivery":
        return "secondary";
      case "waiting for payment":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  const columns = [
    { key: "transaction_id", label: "TRANSACTION ID" },
    { key: "po_id", label: "PURCHASE ORDER ID" },
    { key: "date", label: "DATE" },
    { key: "time", label: "TIME" },
    { key: "payment_method", label: "METHOD" },
    { key: "amount", label: "AMOUNT" },
  ];

  const LoadingRow = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.key}>
          <Skeleton className="h-3 w-3/4 rounded-lg" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="mb-40 space-y-5">
      <h3 className="font-bold text-xl">Transaction</h3>
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="bordered"
        size="lg"
        selectedKey={currentTab}
      />

      <Table
        color="primary"
        isHeaderSticky
        aria-label="transaction table"
        classNames={{
          wrapper: "min-h-[400px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredTransactions}
          emptyContent={!isLoading && "No transaction records found"}
          loadingContent={
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <LoadingRow key={index} />
              ))}
            </div>
          }
          isLoading={isLoading}
        >
          {(transaction) => {
            const date = new Date(transaction.create_date_time);
            return (
              <TableRow
                key={transaction.id}
                className="cursor-pointer hover:bg-primary-100"
                as={Link}
                href={`/manager/purchase-order/detail/${transaction.type === "cpo" ? "cpo" : "mpo"}/${transaction.po_id}`}
              >
                <TableCell>{formatId("T", transaction.id)}</TableCell>
                <TableCell>
                  {formatId(
                    transaction.type === "cpo" ? "CPO" : "MPO",
                    transaction.po_id
                  )}
                </TableCell>
                <TableCell>{format(date, "dd MMM yyyy")}</TableCell>
                <TableCell>{format(date, "HH:mm")}</TableCell>
                <TableCell>
                  {getPaymentMethod(transaction.payment_method)}
                </TableCell>
                <TableCell className="text-primary">
                  {transaction.type === "cpo" ? "" : "-"}
                  {formatNumberWithComma(transaction.amount)}
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}

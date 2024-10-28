"use client";

import TabsSelect from "@/components/tabs-select";
import { History } from "@/interfaces/history.interface";
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
import { getHistoryStatus } from "@/utils/get-history-status";
import Link from "next/link";
interface Props {
  histories: History[];
  isLoading: boolean;
}

export default function HistoryTab({ histories, isLoading }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [currentTab, setCurrentTab] = useState("customer");

  const tabs = [
    { id: "customer", label: "Customer" },
    { id: "material", label: "Material" },
  ];

  const filteredHistory = useMemo(() => {
    return histories.filter((history) => {
      switch (currentTab) {
        case "material":
          return history.type === "MPO";
        default:
          return history.type === "CPO";
      }
    });
  }, [histories, currentTab]);

  const handleTabChange = (key: Key) => {
    const newTab = key.toString();
    setCurrentTab(newTab);
    startTransition(() => {
      router.push(`${pathname}?type=${newTab}`);
    });
  };

  const columns = [
    { key: "purchaseOrderId", label: "PURCHASE ORDER ID" },
    { key: "status", label: "STATUS" },
    { key: "date", label: "DATE" },
    { key: "time", label: "TIME" },
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
      <h3 className="font-bold text-xl">History</h3>
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="bordered"
        size="lg"
        selectedKey={currentTab}
      />

      <Table
        aria-label="History table"
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
          items={filteredHistory}
          emptyContent={!isLoading && "No history records found"}
          loadingContent={
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <LoadingRow key={index} />
              ))}
            </div>
          }
          isLoading={isLoading}
        >
          {(history) => {
            const date = new Date(history.date_time);
            return (
              <TableRow
                key={history.id}
                className="cursor-pointer hover:bg-primary-100"
                as={Link}
                href={`/manager/purchase-order/detail/${history.type === "CPO" ? "cpo" : "mpo"}/${history.po_id}`}
              >
                <TableCell>
                  {formatId(
                    history.type === "CPO" ? "CPO" : "MPO",
                    history.po_id
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    color={getHistoryStatus(history.status).color}
                    variant="flat"
                  >
                    {getHistoryStatus(history.status).label}
                  </Chip>
                </TableCell>
                <TableCell>{format(date, "dd MMM yyyy")}</TableCell>
                <TableCell>{format(date, "HH:mm")}</TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}

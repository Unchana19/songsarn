"use client";

import TabsSelect from "@/components/tabs-select";
import { History } from "@/interfaces/history.interface";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Key, useTransition } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Chip } from "@nextui-org/chip";

interface Props {
  histories: History[];
}

export default function HistoryTab({ histories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "customer", label: "Customer" },
    { id: "material", label: "Material" },
  ];

  const handleTabChange = (key: Key) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key.toString());
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in process":
        return "warning";
      case "completed":
        return "success";
      case "waiting":
        return "primary";
      case "received":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="mb-40">
      <h3 className="font-bold text-xl mb-5">History</h3>
      <TabsSelect
        tabs={tabs}
        handleTabChange={handleTabChange}
        isPending={isPending}
        variant="bordered"
        size={"lg"}
      />

      <div>
        {tabs.map((tab) => {
          const isSelected = searchParams.get("type") === tab.id;
          return isSelected ? (
            <div className="mt-5">
              <Table
                aria-label="Purchase order history table"
                classNames={{
                  wrapper: "min-h-[200px]",
                }}
              >
                <TableHeader>
                  <TableColumn>PURCHASE ORDER ID</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>TIME</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No histories to display"}>
                  {histories.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>PO-{item.id}</TableCell>
                      <TableCell>
                        <Chip
                          color={getStatusColor(item.status)}
                          variant="flat"
                          size="sm"
                        >
                          {item.status}
                        </Chip>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

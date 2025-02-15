import type { StockStatus } from "@/interfaces/dashboard.interface";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import Link from "next/link";

interface Props {
  stockStatus: StockStatus[];
}

export default function StockStatusCard({ stockStatus }: Props) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Stock Status</h2>
          <p className="text-default-500 text-sm">Current inventory levels</p>
        </div>
        <Button
          as={Link}
          color="primary"
          variant="light"
          href="/manager/stock"
          className="font-medium"
        >
          View All
        </Button>
      </div>
      <div className="space-y-6">
        {stockStatus.map((item: StockStatus, index: number) => (
          <div key={item.id}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-default-500 text-sm">
                  {item.remaining_quantity} {item.unit} remaining
                </p>
              </div>
              <Chip
                className={`${
                  item.status === "Out"
                    ? "bg-red-100 text-red-600"
                    : item.status === "Low"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                }`}
              >
                {item.status}
              </Chip>
            </div>
            {index < stockStatus.length - 1 && <Divider className="my-4" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

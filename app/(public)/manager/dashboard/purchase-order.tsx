import type { PurchaseOrder } from "@/interfaces/dashboard.interface";
import { formatId } from "@/utils/format-id";
import { getHistoryStatus } from "@/utils/get-history-status";
import { getPaymentMethod } from "@/utils/get-payment-method";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

interface Props {
  purchaseOrders: PurchaseOrder[];
}

export default function PurchaseOrdersCard({ purchaseOrders }: Props) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Purchase Orders</h2>
          <p className="text-default-500 text-sm">Recent customer orders</p>
        </div>
        <Button
          as={Link}
          color="primary"
          variant="light"
          href="/manager/purchase-order"
          className="font-medium"
        >
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {purchaseOrders.map((order: PurchaseOrder) => (
          <Link
            href={`/manager/purchase-order/detail/cpo/${order.order_id}`}
            key={order.order_id}
            className="group flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-all"
          >
            {/* Order Info */}
            <div className="flex-grow space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {formatId("CPO", order.order_id)}
                    </h3>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getHistoryStatus(order.status).color}
                    >
                      {getHistoryStatus(order.status).label}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-primary-100 text-primary"
                    >
                      {order.product_quantity} items
                    </Chip>
                    <span className="text-default-500">•</span>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-default-100 text-default-600"
                    >
                      {getPaymentMethod(order.payment_method)}
                    </Chip>
                    <span className="text-default-500">•</span>
                    <span className="text-default-700 font-medium">
                      {formatNumberWithComma(order.total_amount)}
                    </span>
                  </div>
                  {/* Delivery Date */}
                  <div className="flex items-center text-sm text-default-500">
                    <span>
                      {order.status === "ON DELIVERY" ||
                      order.status === "COMPLETED"
                        ? "Delivered on:"
                        : "Est. delivery:"}
                    </span>
                    <span className="ml-1">{order.delivery_date}</span>
                  </div>
                </div>

                <Button isIconOnly variant="light">
                  <IoIosArrowForward size={20} />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

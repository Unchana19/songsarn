import type { Transaction } from "@/interfaces/dashboard.interface";
import { formatId } from "@/utils/format-id";
import { getPaymentMethod } from "@/utils/get-payment-method";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { format } from "date-fns";
import Link from "next/link";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface Props {
  recentTrancactions: Transaction[];
}

export default function RecentTransactions({ recentTrancactions }: Props) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <p className="text-default-500 text-sm">
            Latest financial activities
          </p>
        </div>
        <Button
          as={Link}
          color="primary"
          variant="light"
          href="/manager/transaction"
          className="font-medium"
        >
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {recentTrancactions.map((transaction: Transaction) => (
          <div
            key={transaction.transaction_id}
            className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 rounded-lg bg-default-50"
          >
            {/* Transaction Icon & Type */}
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  transaction.type === "cpo"
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {transaction.type === "cpo" ? (
                  <FaArrowUp className="w-4 h-4" />
                ) : (
                  <FaArrowDown className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {formatId(
                    transaction.type === "cpo" ? "CPO" : "MPO",
                    transaction.po_id
                  )}
                </p>
                <p className="text-xs text-default-500">
                  {format(
                    new Date(transaction.date_time),
                    "dd MMM yyyy, HH:mm"
                  )}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="ml-9 sm:ml-0 sm:flex-1">
              <Chip size="sm" variant="flat" className="bg-default-100">
                {getPaymentMethod(transaction.method)}
              </Chip>
            </div>

            {/* Amount */}
            <div
              className={`ml-9 sm:ml-0 font-medium ${
                transaction.type === "cpo" ? "text-success" : "text-danger"
              }`}
            >
              {transaction.type === "cpo" ? "+" : "-"}
              {formatNumberWithComma(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

import type { TimeFrame } from "@/enums/timeframe.enum";
import type { DashboardSummary } from "@/interfaces/dashboard.interface";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Card } from "@heroui/card";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface Props {
  dashboardSummary: DashboardSummary;
  timeframe: TimeFrame;
}

export default function SummaryRevenue({ dashboardSummary, timeframe }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 bg-gradient-to-br from-primary-300 to-primary-600">
        <p className="text-black/80 text-sm">Total Revenue</p>
        <h3 className="text-3xl font-bold text-black mt-2 mb-4">
          {formatNumberWithComma(dashboardSummary.revenue.current)}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              dashboardSummary.revenue.percentageChange > 0
                ? "bg-white/20 text-black"
                : "bg-white/20 text-black"
            }`}
          >
            {dashboardSummary.revenue.percentageChange > 0 ? (
              <FaArrowUp size={12} />
            ) : (
              <FaArrowDown size={12} />
            )}
            <span className="text-sm">
              {Math.abs(dashboardSummary.revenue.percentageChange)}%
            </span>
          </div>
          <span className="text-black/80 text-sm">
            from {timeframe === "day" ? "yesterday" : `last ${timeframe}`}
          </span>
        </div>
      </Card>

      <Card className="p-6 border-1">
        <p className="text-default-500 text-sm">Total Expense</p>
        <h3 className="text-3xl font-bold mt-2 mb-4">
          {formatNumberWithComma(dashboardSummary.expense.current)}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              dashboardSummary.expense.percentageChange > 0
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {dashboardSummary.expense.percentageChange > 0 ? (
              <FaArrowUp size={12} />
            ) : (
              <FaArrowDown size={12} />
            )}
            <span className="text-sm">
              {Math.abs(dashboardSummary.expense.percentageChange)}%
            </span>
          </div>
          <span className="text-default-500 text-sm">
            from {timeframe === "day" ? "yesterday" : `last ${timeframe}`}
          </span>
        </div>
      </Card>

      <Card className="p-6 border-1">
        <p className="text-default-500 text-sm">Products Sold</p>
        <h3 className="text-3xl font-bold mt-2 mb-4">
          {dashboardSummary.productsSold.current}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              dashboardSummary.productsSold.percentageChange > 0
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {dashboardSummary.productsSold.percentageChange > 0 ? (
              <FaArrowUp size={12} />
            ) : (
              <FaArrowDown size={12} />
            )}
            <span className="text-sm">
              {Math.abs(dashboardSummary.productsSold.percentageChange)}%
            </span>
          </div>
          <span className="text-default-500 text-sm">
            from {timeframe === "day" ? "yesterday" : `last ${timeframe}`}
          </span>
        </div>
      </Card>

      <Card className="p-6 border-1">
        <p className="text-default-500 text-sm">Total Orders</p>
        <h3 className="text-3xl font-bold mt-2 mb-4">
          {dashboardSummary.orders.current}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              dashboardSummary.orders.percentageChange > 0
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {dashboardSummary.orders.percentageChange > 0 ? (
              <FaArrowUp size={12} />
            ) : (
              <FaArrowDown size={12} />
            )}
            <span className="text-sm">
              {Math.abs(dashboardSummary.orders.percentageChange)}%
            </span>
          </div>
          <span className="text-default-500 text-sm">
            from {timeframe === "day" ? "yesterday" : `last ${timeframe}`}
          </span>
        </div>
      </Card>
    </div>
  );
}

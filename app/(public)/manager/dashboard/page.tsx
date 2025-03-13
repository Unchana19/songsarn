"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { useSession } from "next-auth/react";

import type { TimeFrame } from "@/enums/timeframe.enum";
import { useFetchDashboardQuery } from "@/store";
import { formatDateRange } from "@/utils/format-data-range";
import SummaryRevenue from "./summary-revenue";
import RevenueChart from "./revenue-chart";
import StockStatusCard from "./stock-status";
import TopSellersCard from "./top-sellers";
import RecentTransactions from "./recent-transaction";
import UnsoldProductsCard from "./unsold-product";
import PurchaseOrdersCard from "./purchase-order";
import Loading from "@/app/loading";
import ForecastRevenueChart from "./forecast-revenue";

export default function DashboardPage() {
  const session = useSession();
  const [timeframe, setTimeframe] = useState<TimeFrame>("week");
  const [date] = useState(new Date());

  const {
    currentData: dashboardData,
    isLoading,
    isSuccess,
  } = useFetchDashboardQuery({
    timeframe,
    date,
    accessToken: session.data?.accessToken || "",
  });

  if (!dashboardData || isLoading || !isSuccess) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-primary">
            Dashboard Overview
          </h1>
          <p className="text-default-500">Track your business performance</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex gap-2 p-1 bg-default-100 rounded-lg">
            {(["day", "week", "month", "year"] as TimeFrame[]).map((tf) => (
              <Button
                key={tf}
                size="sm"
                variant={timeframe === tf ? "solid" : "light"}
                color="primary"
                onPress={() => setTimeframe(tf)}
                className="capitalize"
              >
                {tf === "day" ? "Today" : tf}
              </Button>
            ))}
          </div>
          <Button
            color="primary"
            variant="bordered"
            className="font-medium opacity-100"
            isDisabled
          >
            {formatDateRange(timeframe, date)}
          </Button>
        </div>
      </div>

      {/* Summary Revenue */}
      <SummaryRevenue
        dashboardSummary={dashboardData.summary}
        timeframe={timeframe}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <RevenueChart
          dailyRevenue={dashboardData.dailyRevenue}
          timeframe={timeframe}
        />

        <ForecastRevenueChart
          actualRevenue={dashboardData.dailyRevenue}
          forecastRevenue={dashboardData.forecastRevenue}
          timeframe={timeframe}
        />
      </div>

      {/* Predict Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Status */}
        <StockStatusCard stockStatus={dashboardData.stockStatus} />

        {/* Purchase Orders Card */}
        <PurchaseOrdersCard purchaseOrders={dashboardData.purchaseOrders} />
      </div>

      {/* Top 5 Sellers Section */}
      <TopSellersCard topSellers={dashboardData.topSellers} />

      {/* Recent Transactions and Unsold Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <RecentTransactions
          recentTrancactions={dashboardData.recentTransactions}
        />

        {/* Unsold Products */}
        <UnsoldProductsCard unsoldProducts={dashboardData.unsoldProducts} />
      </div>
    </div>
  );
}

"use client";

import { Card } from "@nextui-org/card";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { format } from "date-fns";
import { Select, SelectItem } from "@nextui-org/select";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Chip } from "@nextui-org/chip";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { DashboardData } from "@/interfaces/dashboard.interface";
import { useSession } from "next-auth/react";

type TimeFrame = "day" | "week" | "month" | "year";

export default function DashboardPage() {
  const session = useSession();
  const [timeframe, setTimeframe] = useState<TimeFrame>("week");
  const [date, setDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = session.data?.accessToken;
      const response = await fetch(
        `/api/dashboard?timeframe=${timeframe}&date=${date.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [timeframe, date]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDateRange = () => {
    switch (timeframe) {
      case "day":
        return format(date, "dd MMM yyyy");
      case "week":
        const start = date;
        const end = new Date(date);
        end.setDate(end.getDate() + 6);
        return `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`;
      case "month":
        return format(date, "MMM yyyy");
      case "year":
        return format(date, "yyyy");
    }
  };

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={timeframe === "day" ? "solid" : "bordered"}
              color="primary"
              onPress={() => setTimeframe("day")}
            >
              Day
            </Button>
            <Button
              variant={timeframe === "week" ? "solid" : "bordered"}
              color="primary"
              onPress={() => setTimeframe("week")}
            >
              Week
            </Button>
            <Button
              variant={timeframe === "month" ? "solid" : "bordered"}
              color="primary"
              onPress={() => setTimeframe("month")}
            >
              Month
            </Button>
            <Button
              variant={timeframe === "year" ? "solid" : "bordered"}
              color="primary"
              onPress={() => setTimeframe("year")}
            >
              Year
            </Button>
          </div>
          <Button color="primary">{formatDateRange()}</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-primary">
          <p className="text-white mb-2">Total Revenue</p>
          <h3 className="text-2xl font-bold text-white mb-2">
            {formatNumberWithComma(dashboardData.summary.revenue.current)}
          </h3>
          <div className="flex items-center gap-2">
            {dashboardData.summary.revenue.percentageChange > 0 ? (
              <FaArrowUp className="text-white" />
            ) : (
              <FaArrowDown className="text-white" />
            )}
            <span className="text-white text-sm">
              {Math.abs(dashboardData.summary.revenue.percentageChange)}% from
              last {timeframe}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-1">
          <p className="mb-2">Total Expense</p>
          <h3 className="text-2xl font-bold mb-2">
            {formatNumberWithComma(dashboardData.summary.expense.current)}
          </h3>
          <div className="flex items-center gap-2">
            {dashboardData.summary.expense.percentageChange > 0 ? (
              <FaArrowUp className="text-red-500" />
            ) : (
              <FaArrowDown className="text-green-500" />
            )}
            <span className="text-default-500 text-sm">
              {Math.abs(dashboardData.summary.expense.percentageChange)}% from
              last {timeframe}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-1">
          <p className="mb-2">Product sold</p>
          <h3 className="text-2xl font-bold mb-2">
            {dashboardData.summary.productsSold.current}
          </h3>
          <div className="flex items-center gap-2">
            {dashboardData.summary.productsSold.percentageChange > 0 ? (
              <FaArrowUp className="text-green-500" />
            ) : (
              <FaArrowDown className="text-red-500" />
            )}
            <span className="text-default-500 text-sm">
              {Math.abs(dashboardData.summary.productsSold.percentageChange)}%
              from last {timeframe}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-1">
          <p className="mb-2">Orders</p>
          <h3 className="text-2xl font-bold mb-2">
            {dashboardData.summary.orders.current}
          </h3>
          <div className="flex items-center gap-2">
            {dashboardData.summary.orders.percentageChange > 0 ? (
              <FaArrowUp className="text-green-500" />
            ) : (
              <FaArrowDown className="text-red-500" />
            )}
            <span className="text-default-500 text-sm">
              {Math.abs(dashboardData.summary.orders.percentageChange)}% from
              last {timeframe}
            </span>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Total Revenue</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stock Status */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Stock Quantity</h2>
          <Button
            color="primary"
            variant="light"
            className="font-medium"
            href="/stock"
          >
            see all
          </Button>
        </div>
        <div className="space-y-4">
          {dashboardData.stockStatus.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-default-500">
                  Remaining Quantity: {item.remaining_quantity} {item.unit}
                </p>
              </div>
              <Chip
                color={
                  item.status === "Out"
                    ? "danger"
                    : item.status === "Low"
                      ? "warning"
                      : "success"
                }
              >
                {item.status}
              </Chip>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

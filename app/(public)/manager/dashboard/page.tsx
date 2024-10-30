"use client";

import { Card } from "@nextui-org/card";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { format } from "date-fns";
import { FaArrowDown, FaArrowUp, FaTrophy } from "react-icons/fa6";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { DashboardData } from "@/interfaces/dashboard.interface";
import { useSession } from "next-auth/react";
import { Progress } from "@nextui-org/progress";
import { formatCurrency } from "@/utils/format-currency";
import { Image } from "@nextui-org/image";
import ImagePlaceholder from "@/components/image-placeholder";
import { formatId } from "@/utils/format-id";
import { getHistoryStatus } from "@/utils/get-history-status";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { getPaymentMethod } from "@/utils/get-payment-method";

type TimeFrame = "day" | "week" | "month" | "year";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-4 shadow-lg border-none bg-white/90 backdrop-blur-sm">
        <p className="font-medium">{label}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} className="text-sm">
            <span className="font-medium">{pld.name}: </span>
            <span>{formatNumberWithComma(pld.value)}</span>
          </div>
        ))}
      </Card>
    );
  }
  return null;
};

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
  }, [session, timeframe, date]);

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

  if (!dashboardData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Progress
            size="sm"
            isIndeterminate
            aria-label="Loading..."
            className="max-w-md"
          />
          <p className="text-default-500">Loading dashboard data...</p>
        </div>
      </div>
    );
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
          <Button color="primary" variant="bordered" className="font-medium">
            {formatDateRange()}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary to-primary-600">
          <p className="text-black/80 text-sm">Total Revenue</p>
          <h3 className="text-3xl font-bold text-black mt-2 mb-4">
            {formatNumberWithComma(dashboardData.summary.revenue.current)}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                dashboardData.summary.revenue.percentageChange > 0
                  ? "bg-white/20 text-black"
                  : "bg-white/20 text-black"
              }`}
            >
              {dashboardData.summary.revenue.percentageChange > 0 ? (
                <FaArrowUp size={12} />
              ) : (
                <FaArrowDown size={12} />
              )}
              <span className="text-sm">
                {Math.abs(dashboardData.summary.revenue.percentageChange)}%
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
            {formatNumberWithComma(dashboardData.summary.expense.current)}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                dashboardData.summary.expense.percentageChange > 0
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {dashboardData.summary.expense.percentageChange > 0 ? (
                <FaArrowUp size={12} />
              ) : (
                <FaArrowDown size={12} />
              )}
              <span className="text-sm">
                {Math.abs(dashboardData.summary.expense.percentageChange)}%
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
            {dashboardData.summary.productsSold.current}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                dashboardData.summary.productsSold.percentageChange > 0
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {dashboardData.summary.productsSold.percentageChange > 0 ? (
                <FaArrowUp size={12} />
              ) : (
                <FaArrowDown size={12} />
              )}
              <span className="text-sm">
                {Math.abs(dashboardData.summary.productsSold.percentageChange)}%
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
            {dashboardData.summary.orders.current}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                dashboardData.summary.orders.percentageChange > 0
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {dashboardData.summary.orders.percentageChange > 0 ? (
                <FaArrowUp size={12} />
              ) : (
                <FaArrowDown size={12} />
              )}
              <span className="text-sm">
                {Math.abs(dashboardData.summary.orders.percentageChange)}%
              </span>
            </div>
            <span className="text-default-500 text-sm">
              from {timeframe === "day" ? "yesterday" : `last ${timeframe}`}
            </span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Revenue Trend</h2>
              <p className="text-default-500 text-sm">Revenue over time</p>
            </div>
            <Chip color="primary" variant="flat">
              {timeframe.toUpperCase()}
            </Chip>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" stroke="#666" fontSize={12} />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  width={60}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Stock Status */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Stock Status</h2>
              <p className="text-default-500 text-sm">
                Current inventory levels
              </p>
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
            {dashboardData.stockStatus.map((item, index) => (
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
                {index < dashboardData.stockStatus.length - 1 && (
                  <Divider className="my-4" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top 5 Sellers Section */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-6">
          <div>
            <h2 className="text-xl font-bold">Top 5 Sellers</h2>
            <p className="text-default-500 text-sm">Best performing products</p>
          </div>
          <Chip
            color="primary"
            variant="flat"
            startContent={<FaTrophy size={16} />}
            className="self-start sm:self-auto"
          >
            Total:{" "}
            {formatNumberWithComma(
              dashboardData.topSellers.reduce(
                (sum, item) => sum + item.total,
                0
              )
            )}
          </Chip>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {dashboardData.topSellers.map((item, index) => (
            <div
              key={item.product_id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
            >
              {/* Top Section for Mobile - Ranking, Image, and Basic Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Ranking Number - Minimal Style */}
                <div className="flex-shrink-0 w-8 text-center">
                  <span
                    className={`text-xl font-semibold ${
                      index === 0
                        ? "text-primary"
                        : index === 1
                          ? "text-zinc-400"
                          : "text-default-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Product Image */}
                <div className="flex-shrink-0">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-lg bg-default-200"
                    />
                  ) : (
                    <ImagePlaceholder
                      name={item.product_name.substring(0, 2).toUpperCase()}
                      classNames="w-16 h-16"
                    />
                  )}
                </div>

                {/* Basic Product Info for Mobile */}
                <div className="flex-grow min-w-0 sm:hidden">
                  <h3 className="font-medium text-default-900 truncate">
                    {item.product_name}
                  </h3>
                  <p className="text-small text-default-500">{item.category}</p>
                </div>
              </div>

              {/* Product Details - Hidden on Mobile */}
              <div className="hidden sm:block flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-default-900 truncate">
                    {item.product_name}
                  </h3>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-default-100 text-default-600"
                  >
                    {formatId("P", item.product_id)}
                  </Chip>
                </div>
                <p className="text-small text-default-500">{item.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Chip variant="flat" className="bg-primary-100 text-primary">
                    {item.quantity} units
                  </Chip>
                  <span className="text-default-500">•</span>
                  <span className="text-default-700">
                    {formatNumberWithComma(item.price)} /unit
                  </span>
                </div>
              </div>

              {/* Additional Info for Mobile */}
              <div className="sm:hidden w-full pl-12">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-default-100 text-default-600"
                  >
                    {formatId("P", item.product_id)}
                  </Chip>
                  <Chip variant="flat" className="bg-primary-100 text-primary">
                    {item.quantity} units
                  </Chip>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-default-700">
                    {formatNumberWithComma(item.price)} /unit
                  </span>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatNumberWithComma(item.total)}
                    </p>
                    <p className="text-small text-default-500">Total Sales</p>
                  </div>
                </div>
              </div>

              {/* Total Sales - Hidden on Mobile */}
              <div className="hidden sm:block flex-shrink-0 text-right">
                <p className="font-semibold text-primary">
                  {formatNumberWithComma(item.total)}
                </p>
                <p className="text-small text-default-500">Total Sales</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Transactions and Unsold Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
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
            {dashboardData.recentTransactions.map((transaction) => (
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

        {/* Unsold Products */}
        <Card className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Unsold Products</h2>
              <p className="text-default-500 text-sm">
                Products without sales in 30 days
              </p>
            </div>
            <Button
              as={Link}
              color="primary"
              variant="light"
              href="/manager/product-component"
              className="font-medium"
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {dashboardData.unsoldProducts.map((product) => (
              <div
                key={product.product_id}
                className="flex gap-4 p-4 rounded-lg bg-default-50"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-default-200"
                    />
                  ) : (
                    <ImagePlaceholder
                      name={product.name.substring(0, 2).toUpperCase()}
                      classNames="w-16 h-16"
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-default-900 truncate">
                      {product.name}
                    </h3>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-default-100 text-default-600"
                    >
                      {formatId("P", product.product_id)}
                    </Chip>
                  </div>
                  <p className="text-small text-default-500">
                    {product.category}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-default-700 font-medium">
                      {formatNumberWithComma(product.price)} ฿
                    </span>
                    <span className="text-default-500">•</span>
                    <Chip size="sm" color="danger" variant="flat">
                      {product.days_without_sale_text}
                    </Chip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Purchase Orders Card */}
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
          {dashboardData.purchaseOrders.map((order) => (
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
                    <div className="flex items-center gap-2 mt-1">
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
    </div>
  );
}

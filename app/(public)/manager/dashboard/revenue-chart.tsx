import type { TimeFrame } from "@/enums/timeframe.enum";
import type { DailyRevenue } from "@/interfaces/dashboard.interface";
import { formatCurrency } from "@/utils/format-currency";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  type TooltipProps,
} from "recharts";

interface Props {
  dailyRevenue: DailyRevenue[];
  timeframe: TimeFrame;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-4 shadow-lg border-none bg-white/90 backdrop-blur-sm">
        <p className="font-medium">{label}</p>
        {payload.map((pld) => (
          <div key={pld.name} className="text-sm">
            <span className="font-medium">{pld.name}: </span>
            <span>{formatNumberWithComma(pld.value ?? 0)}</span>
          </div>
        ))}
      </Card>
    );
  }
  return null;
};

export default function RevenueChart({ dailyRevenue, timeframe }: Props) {
  return (
    <div>
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
            <AreaChart data={dailyRevenue}>
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
    </div>
  );
}

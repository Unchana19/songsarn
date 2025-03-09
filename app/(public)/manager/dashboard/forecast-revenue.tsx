import type { TimeFrame } from "@/enums/timeframe.enum";
import type { DailyRevenue } from "@/interfaces/dashboard.interface";
import { formatCurrency } from "@/utils/format-currency";
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
  Legend,
} from "recharts";

interface Props {
  actualRevenue: DailyRevenue[];
  forecastRevenue: DailyRevenue[];
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
          <div key={pld.name} className="text-sm flex items-center gap-2 mt-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: pld.color }}
            />
            <span className="font-medium">{pld.name}: </span>
            <span>{formatCurrency(pld.value ?? 0)}</span>
          </div>
        ))}
      </Card>
    );
  }
  return null;
};

export default function ForecastRevenueChart({
  actualRevenue,
  forecastRevenue,
  timeframe,
}: Props) {
  // Combine data for the chart, ensuring we have labels from both datasets
  const combinedData = actualRevenue.map((actual) => {
    const forecast = forecastRevenue.find((f) => f.label === actual.label);
    return {
      label: actual.label,
      actual: actual.revenue,
      forecast: forecast?.revenue || 0,
    };
  });

  return (
    <div>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Forecast Revenue</h2>
            <p className="text-default-500 text-sm">
              Projected revenue forecast analysis
            </p>
          </div>
          <Chip color="primary" variant="flat">
            {timeframe.toUpperCase()}
          </Chip>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                stroke="#666"
                fontSize={12}

              />
              <YAxis
                stroke="#666"
                fontSize={12}
                width={60}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#D4AF37"
                strokeWidth={2.5}
                fill="url(#colorActual)"
                name="Actual Revenue"
                strokeOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#4CAF50"
                strokeWidth={1.5}
                fill="url(#colorForecast)"
                name="Forecast Revenue"
                strokeOpacity={0.7}
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

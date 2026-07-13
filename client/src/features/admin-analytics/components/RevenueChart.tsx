import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsPoint } from "../types";
import AnalyticsCard from "./AnalyticsCard";
import EmptyChartState from "./EmptyChartState";

interface RevenueChartProps {
  title: string;
  data: AnalyticsPoint[];
}

export default function RevenueChart({ title, data }: RevenueChartProps) {
  return (
    <AnalyticsCard title={title} subtitle="Щомісячна динаміка доходу">
      {data.length === 0 ? (
        <EmptyChartState message="Немає платежів за обраний період." />
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={290}>
            <AreaChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="label" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip
                contentStyle={{
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                }}
                formatter={(value) => `${Number(value ?? 0).toLocaleString("uk-UA")} грн`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                name="Дохід"
                stroke="var(--accent)"
                fill="url(#revenueFill)"
                strokeWidth={2.7}
                animationDuration={820}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}

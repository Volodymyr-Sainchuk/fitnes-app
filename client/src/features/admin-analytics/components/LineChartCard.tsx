import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsPoint } from "../types";
import AnalyticsCard from "./AnalyticsCard";
import EmptyChartState from "./EmptyChartState";

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  data: AnalyticsPoint[];
  lineLabel?: string;
  color?: string;
}

export default function LineChartCard({
  title,
  subtitle,
  data,
  lineLabel = "Значення",
  color = "var(--accent)",
}: LineChartCardProps) {
  return (
    <AnalyticsCard title={title} subtitle={subtitle}>
      {data.length === 0 ? (
        <EmptyChartState message="Немає даних для відображення графіка." />
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={data} margin={{ top: 16, right: 18, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="label" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip
                cursor={{ stroke: "rgba(183,255,47,0.35)", strokeWidth: 1 }}
                contentStyle={{
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={lineLabel}
                stroke={color}
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 0, fill: color }}
                activeDot={{ r: 6 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { NameValuePoint } from "../types";
import AnalyticsCard from "./AnalyticsCard";
import EmptyChartState from "./EmptyChartState";

const defaultPalette = ["var(--accent)", "#5bc0ff", "#ffa657", "#e879f9", "#ff6b6b", "#f9d423", "#34d399"];

interface PieChartCardProps {
  title: string;
  subtitle?: string;
  data: NameValuePoint[];
  donut?: boolean;
  palette?: string[];
}

export default function PieChartCard({
  title,
  subtitle,
  data,
  donut = false,
  palette = defaultPalette,
}: PieChartCardProps) {
  const hasData = data.some((item) => item.value > 0);

  return (
    <AnalyticsCard title={title} subtitle={subtitle}>
      {!hasData ? (
        <EmptyChartState message="Недостатньо даних для діаграми в обраному періоді." />
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={92}
                innerRadius={donut ? 56 : 0}
                paddingAngle={3}
                animationDuration={780}
              >
                {data.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { NameValuePoint } from "../types";
import AnalyticsCard from "./AnalyticsCard";
import EmptyChartState from "./EmptyChartState";

interface MembersChartProps {
  title: string;
  data: NameValuePoint[];
}

export default function MembersChart({ title, data }: MembersChartProps) {
  const hasData = data.some((item) => item.value > 0);

  return (
    <AnalyticsCard title={title} subtitle="Розподіл учасників за категоріями">
      {!hasData ? (
        <EmptyChartState message="Дані для цього зрізу поки не збираються." />
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="name" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip
                cursor={{ fill: "rgba(183,255,47,0.08)" }}
                contentStyle={{
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                }}
              />
              <Legend />
              <Bar
                dataKey="value"
                name="Кількість"
                fill="var(--accent)"
                radius={[8, 8, 0, 0]}
                animationDuration={820}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}

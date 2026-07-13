import type { ReactNode } from "react";
import type { Comparison } from "../types";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  comparison: Comparison;
  valueFormatter?: (value: number) => string;
}

export default function StatCard({ icon, title, value, comparison, valueFormatter }: StatCardProps) {
  const trendClass = comparison.trend === "up" ? "is-up" : comparison.trend === "down" ? "is-down" : "is-flat";
  const displayValue = valueFormatter ? valueFormatter(value) : value.toLocaleString("uk-UA");

  return (
    <article className="stat-card-modern">
      <div className="stat-card-icon" aria-hidden="true">
        {icon}
      </div>
      <p className="section-eyebrow">{title}</p>
      <p className="stat-card-value">{displayValue}</p>
      <p className={`stat-card-trend ${trendClass}`}>
        <span className="trend-dot" />
        {comparison.label}
      </p>
    </article>
  );
}

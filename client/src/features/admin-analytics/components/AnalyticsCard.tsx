import type { PropsWithChildren, ReactNode } from "react";

interface AnalyticsCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  className?: string;
}

export default function AnalyticsCard({ title, subtitle, rightSlot, className = "", children }: AnalyticsCardProps) {
  return (
    <article className={`analytics-card info-card ${className}`.trim()}>
      <header className="analytics-card-head">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {rightSlot}
      </header>
      <div className="analytics-card-body">{children}</div>
    </article>
  );
}

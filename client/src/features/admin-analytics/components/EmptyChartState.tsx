interface EmptyChartStateProps {
  message: string;
}

export default function EmptyChartState({ message }: EmptyChartStateProps) {
  return (
    <div className="analytics-empty-state" role="status">
      <p>{message}</p>
    </div>
  );
}

import { Activity } from "lucide-react";

export default function Loader({ label = "Завантаження..." }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <Activity className="loader-icon" />
      <span>{label}</span>
    </div>
  );
}

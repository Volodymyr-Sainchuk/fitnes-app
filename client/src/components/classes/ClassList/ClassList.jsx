import { useEffect, useState } from "react";
import Loader from "../../common/Loader/Loader.jsx";
import { fetchClasses } from "../../../services/classApi.js";
import ClassCard from "../ClassCard/ClassCard.jsx";

export default function ClassList({ onRefresh }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClasses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchClasses();
      setClasses(data);
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  if (loading) return <Loader label="Завантажуємо заняття..." />;
  if (error) return <p className="form-error">{error}</p>;
  if (!classes.length) return <p className="empty-state">Наразі немає активних занять.</p>;

  return (
    <div className="card-grid">
      {classes.map((item) => (
        <ClassCard key={item.id} item={item} onBooked={loadClasses} />
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionTitle from "../../common/SectionTitle/SectionTitle.jsx";
import Loader from "../../common/Loader/Loader.jsx";
import { fetchClasses } from "../../../services/classApi.js";

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchClasses()
      .then((data) => {
        if (active) setClasses(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section-block">
      <SectionTitle
        eyebrow="Популярні заняття"
        title="Обирайте формат, який підходить саме вам"
        description="Від силового до йоги — знайдіть заняття на свій ритм."
      />
      {loading ? (
        <Loader label="Отримуємо розклад..." />
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : classes.length === 0 ? (
        <p className="empty-state">Наразі немає доступних занять, але скоро з’являться нові.</p>
      ) : (
        <div className="card-grid">
          {classes.map((item) => (
            <motion.article
              key={item.id}
              className="info-card"
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="card-top">
                <p className="section-eyebrow">
                  {new Date(item.dateTime).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}
                </p>
                <span className="pill">{item.duration} хв</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="card-meta">
                <span>Тренер: {item.trainer?.user?.name || "Команда"}</span>
                <span>Місць: {item.capacity}</span>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      <div className="section-action">
        <Link to="/classes" className="text-link">
          Переглянути всі заняття <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

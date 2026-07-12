import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionTitle from "../../common/SectionTitle/SectionTitle.jsx";
import Loader from "../../common/Loader/Loader.jsx";
import { fetchTrainers } from "../../../services/trainerApi.js";

export default function TrainersPreview() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchTrainers()
      .then((data) => {
        if (active) setTrainers(Array.isArray(data) ? data.slice(0, 3) : []);
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
        eyebrow="Наші тренери"
        title="Професіонали, які створюють результат"
        description="Кожен із них привносить у тренування власний стиль та мотивацію."
      />
      {loading ? (
        <Loader label="Завантажуємо тренерів..." />
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : trainers.length === 0 ? (
        <p className="empty-state">Наразі тренери ще не додані до клубу.</p>
      ) : (
        <div className="card-grid">
          {trainers.map((trainer) => (
            <article key={trainer.id} className="info-card trainer-card">
              <img
                src={
                  trainer.photo ||
                  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80"
                }
                alt={trainer.user?.name || "Тренер"}
              />
              <h3>{trainer.user?.name || "Тренер"}</h3>
              <p className="accent-text">{trainer.specialization || "Фітнес-експерт"}</p>
              <p>{trainer.bio || "Мотивує, навчає й допомагає досягати цілей."}</p>
            </article>
          ))}
        </div>
      )}
      <div className="section-action">
        <Link to="/trainers" className="text-link">
          Дізнатися про всіх тренерів <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionTitle from "../../common/SectionTitle/SectionTitle.jsx";
import Loader from "../../common/Loader/Loader.jsx";
import { fetchMemberships } from "../../../services/membershipApi.js";

export default function MembershipPreview() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchMemberships()
      .then((data) => {
        if (active) setMemberships(Array.isArray(data) ? data.slice(0, 3) : []);
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
        eyebrow="Абонементи"
        title="Виберіть тариф під ваш ритм життя"
        description="Легко стартуйте, комфортно тренуйтеся й отримуйте максимум користі."
      />
      {loading ? (
        <Loader label="Вибираємо найкращі плани..." />
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : memberships.length === 0 ? (
        <p className="empty-state">Плани абонементів з’являться найближчим часом.</p>
      ) : (
        <div className="card-grid">
          {memberships.map((plan) => (
            <article key={plan.id} className={`info-card plan-card ${plan.isActive ? "recommended" : ""}`}>
              <h3>{plan.name}</h3>
              <p className="price">{plan.price} ₴</p>
              <p className="duration">{plan.durationDays} днів</p>
              <p>{plan.benefits}</p>
            </article>
          ))}
        </div>
      )}
      <div className="section-action">
        <Link to="/memberships" className="text-link">
          Дивитися всі плани <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

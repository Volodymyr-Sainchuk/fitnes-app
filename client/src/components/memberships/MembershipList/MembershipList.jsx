import { useEffect, useState } from "react";
import Loader from "../../common/Loader/Loader.jsx";
import { fetchMemberships } from "../../../services/membershipApi.js";
import MembershipCard from "../MembershipCard/MembershipCard.jsx";

const fallbackPlans = [
  {
    id: 1,
    name: "Start",
    price: 1200,
    durationDays: 30,
    visits: "8 відвідувань",
    benefits: ["8 відвідувань", "Доступ до основного залу", "Персональна реєстрація"],
  },
  {
    id: 2,
    name: "Active",
    price: 1800,
    durationDays: 30,
    visits: "Безлімітний зал",
    benefits: ["Безлімітний зал", "Платформа з програмами", "Доступ до розкладу"],
  },
  {
    id: 3,
    name: "Premium",
    price: 2500,
    durationDays: 30,
    visits: "Безлімітний зал + групові",
    benefits: ["Безлімітний зал", "Групові заняття", "Мотиваційна підтримка"],
  },
  {
    id: 4,
    name: "Ultimate",
    price: 3500,
    durationDays: 30,
    visits: "Усе включено",
    benefits: ["Усе включено", "2 персональні тренування", "VIP розклад"],
  },
];

export default function MembershipList() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchMemberships()
      .then((data) => {
        if (active) setMemberships(Array.isArray(data) && data.length ? data : fallbackPlans);
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

  if (loading) return <Loader label="Завантажуємо абонементи..." />;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="card-grid membership-grid">
      {memberships.map((plan, index) => (
        <MembershipCard key={plan.id || plan.name} plan={plan} recommended={plan.name === "Premium" || index === 1} />
      ))}
    </div>
  );
}

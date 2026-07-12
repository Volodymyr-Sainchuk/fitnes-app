import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Button from "../../common/Button/Button.jsx";
import Modal from "../../common/Modal/Modal.jsx";

const fallbackPlans = [
  {
    name: "Start",
    price: 1200,
    durationDays: 30,
    visits: "8 відвідувань",
    benefits: ["8 відвідувань", "Доступ до основного залу", "Персональна реєстрація"],
  },
  {
    name: "Active",
    price: 1800,
    durationDays: 30,
    visits: "Безлімітний зал",
    benefits: ["Безлімітний зал", "Платформа з програмами", "Доступ до розкладу"],
  },
  {
    name: "Premium",
    price: 2500,
    durationDays: 30,
    visits: "Безлімітний зал + групові",
    benefits: ["Безлімітний зал", "Групові заняття", "Мотиваційна підтримка"],
  },
  {
    name: "Ultimate",
    price: 3500,
    durationDays: 30,
    visits: "Усе включено",
    benefits: ["Усе включено", "2 персональні тренування", "VIP розклад"],
  },
];

export default function MembershipCard({ plan, recommended = false }) {
  const data = plan || {};
  const price = data.price ?? 0;
  const durationDays = data.durationDays ?? 30;
  const benefits = Array.isArray(data.benefits)
    ? data.benefits
    : typeof data.benefits === "string"
      ? data.benefits.split("\n")
      : fallbackPlans.find((item) => item.name === data.name)?.benefits || [];
  const name = data.name || "Абонемент";
  const visits =
    data.visits ||
    (name === "Premium"
      ? "Безлімітний зал + групові"
      : name === "Ultimate"
        ? "Усе включено"
        : name === "Active"
          ? "Безлімітний зал"
          : "8 відвідувань");
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      className={`info-card plan-card ${recommended ? "recommended" : ""}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.22 }}
    >
      {recommended ? <span className="recommended-badge">Найпопулярніший</span> : null}
      <div className="plan-header">
        <h3>{name}</h3>
        <p className="plan-duration">{durationDays} днів</p>
      </div>
      <p className="price">{price} ₴</p>
      <p className="plan-visits">{visits}</p>
      <ul className="plan-benefits">
        {benefits.map((item) => (
          <li key={item}>
            <CheckCircle2 size={16} /> {item}
          </li>
        ))}
      </ul>
      <div className="button-row">
        <Button variant="secondary">Обрати абонемент</Button>
        <Button variant="secondary" className="card-detail-button" onClick={() => setOpen(true)}>
          Детальніше
        </Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={name}>
        <div className="detail-stack">
          <p className="accent-text">
            {durationDays} днів • {price} ₴
          </p>
          <p>{visits}</p>
          <ul className="detail-list">
            {benefits.map((item) => (
              <li key={item}>
                <CheckCircle2 size={16} /> {item}
              </li>
            ))}
          </ul>
          <div className="button-row">
            <Button variant="primary">Обрати абонемент</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Закрити
            </Button>
          </div>
        </div>
      </Modal>
    </motion.article>
  );
}

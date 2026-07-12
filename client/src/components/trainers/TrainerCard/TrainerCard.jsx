import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Send, Sparkles } from "lucide-react";
import Modal from "../../common/Modal/Modal.jsx";
import Button from "../../common/Button/Button.jsx";

const fallbackTrainers = [
  {
    name: "Олександр Коваль",
    specialization: "Силові та функціональні тренування",
    bio: "Побудуємо силу, стабільність та впевненість у русі через структуровані силові блоки.",
    image: "/src/assets/trainers/alexandr.svg",
  },
  {
    name: "Анна Мельник",
    specialization: "Йога та стретчинг",
    bio: "Баланс, гнучкість і м’яка сила для стабільного відновлення та внутрішнього спокою.",
    image: "/src/assets/trainers/anna.svg",
  },
  {
    name: "Максим Бондар",
    specialization: "Кросфіт і витривалість",
    bio: "Сильні кардіо-навчання з акцентом на витривалість, координацію та швидкість.",
    image: "/src/assets/trainers/maxim.svg",
  },
  {
    name: "Софія Левченко",
    specialization: "Персональний тренінг та пілатес",
    bio: "Індивідуальний підхід для постави, м’язового контролю та довгострокового результату.",
    image: "/src/assets/trainers/sofia.svg",
  },
];

export default function TrainerCard({ trainer }) {
  const data = trainer || {};
  const fallback = fallbackTrainers.find((item) => item.name === data.name) || fallbackTrainers[0];
  const image = data.photo || fallback.image;
  const name = data.user?.name || data.name || fallback.name;
  const specialization = data.specialization || fallback.specialization;
  const bio = data.bio || fallback.bio;
  const phone = data.user?.phone || data.phone || "+380501234567";
  const socialEntries = Object.entries(data.user?.socialLinks || data.socialLinks || {}).filter(
    ([, value]) => typeof value === "string" && value.trim(),
  );
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      className="info-card trainer-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.22 }}
    >
      <div className="trainer-portrait-wrap">
        <img src={image} alt={`Портрет тренера ${name}`} className="trainer-portrait" />
      </div>
      <div className="trainer-card-body">
        <div className="trainer-card-heading">
          <h3>{name}</h3>
          <span className="trainer-badge">
            <Sparkles size={14} /> Sportlend
          </span>
        </div>
        <p className="accent-text">{specialization}</p>
        <p>{bio}</p>
        <div className="trainer-actions" aria-label={`Контакти ${name}`}>
          <a href={`tel:${phone}`} aria-label={`Телефон ${name}`} className="icon-link">
            <Phone size={16} />
          </a>
          {socialEntries[0] ? (
            <a
              href={socialEntries[0][1]}
              aria-label={`Соцмережа ${name}`}
              className="icon-link"
              target="_blank"
              rel="noreferrer"
            >
              <Send size={16} />
            </a>
          ) : null}
        </div>
        <Button variant="secondary" className="card-detail-button" onClick={() => setOpen(true)}>
          Детальніше
        </Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={name}>
        <div className="detail-stack">
          <p className="accent-text">{specialization}</p>
          <p>{bio}</p>
          <div className="detail-meta">
            <span>
              <Phone size={14} /> {phone}
            </span>
            {socialEntries.map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noreferrer" className="detail-link">
                {platform}
              </a>
            ))}
          </div>
          <div className="button-row">
            <a className="button primary" href={`tel:${phone}`}>
              Зателефонувати
            </a>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Закрити
            </Button>
          </div>
        </div>
      </Modal>
    </motion.article>
  );
}

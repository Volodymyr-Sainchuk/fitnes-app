import { useEffect, useState } from "react";
import Loader from "../../common/Loader/Loader.jsx";
import { fetchTrainers } from "../../../services/trainerApi.js";
import TrainerCard from "../TrainerCard/TrainerCard.jsx";

const fallbackTrainers = [
  {
    id: 1,
    name: "Олександр Коваль",
    specialization: "Силові та функціональні тренування",
    bio: "Побудуємо силу, стабільність та впевненість у русі через структуровані силові блоки.",
  },
  {
    id: 2,
    name: "Анна Мельник",
    specialization: "Йога та стретчинг",
    bio: "Баланс, гнучкість і м’яка сила для стабільного відновлення та внутрішнього спокою.",
  },
  {
    id: 3,
    name: "Максим Бондар",
    specialization: "Кросфіт і витривалість",
    bio: "Сильні кардіо-навчання з акцентом на витривалість, координацію та швидкість.",
  },
  {
    id: 4,
    name: "Софія Левченко",
    specialization: "Персональний тренінг та пілатес",
    bio: "Індивідуальний підхід для постави, м’язового контролю та довгострокового результату.",
  },
];

export default function TrainerList() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchTrainers()
      .then((data) => {
        if (active) setTrainers(Array.isArray(data) && data.length ? data : fallbackTrainers);
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

  if (loading) return <Loader label="Завантажуємо тренерів..." />;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="card-grid trainer-grid">
      {trainers.map((trainer) => (
        <TrainerCard key={trainer.id || trainer.name} trainer={trainer} />
      ))}
    </div>
  );
}

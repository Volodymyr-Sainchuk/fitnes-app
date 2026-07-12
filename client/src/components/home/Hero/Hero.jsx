import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="section-eyebrow">Новий рівень фітнесу</p>
        <h1>Сила, ритм і впевненість — в одному просторі.</h1>
        <p className="hero-text">
          Відкрийте для себе преміальний клуб з сучасними тренуваннями, персональним супроводом та атмосферою, що
          надихає.
        </p>
        <div className="hero-actions">
          <Link to="/classes" className="button primary">
            <PlayCircle size={18} /> Переглянути заняття
          </Link>
          <Link to="/register" className="button secondary">
            <ArrowRight size={18} /> Приєднатися
          </Link>
        </div>
        <div className="stats-inline">
          <div>
            <strong>6+</strong>
            <span>Рівнів тренувань</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Доступ до залу</span>
          </div>
          <div>
            <strong>4.9</strong>
            <span>Рейтинг клубу</span>
          </div>
        </div>
      </div>
      <motion.div
        className="hero-card"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80"
          alt="Тренер з клієнтом у фітнес-клубі"
        />
      </motion.div>
    </section>
  );
}

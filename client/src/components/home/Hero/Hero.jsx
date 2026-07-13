import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return <section className="hero-section" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="section-eyebrow">Новий рівень фітнесу</p>
      <h1 id="hero-title">Сила, ритм і впевненість — в одному просторі.</h1>
      <p className="hero-text">Відкрийте для себе преміальний клуб із сучасними тренуваннями, персональним супроводом та атмосферою, що надихає рухатися вперед.</p>
      <div className="hero-actions">
        <Link to="/memberships" className="button primary"><ArrowRight size={18} /> Абонементи</Link>
        <Link to="/classes" className="button secondary"><PlayCircle size={18} /> Переглянути заняття</Link>
      </div>
      <div className="hero-highlights" aria-label="Переваги клубу"><span>Сучасний простір</span><span>Турбота тренерів</span><span>Заняття для різних цілей</span></div>
    </div>
    <motion.div className="hero-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
      <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80" alt="Тренер допомагає клієнтці виконувати вправу у фітнес-клубі" />
    </motion.div>
  </section>;
}

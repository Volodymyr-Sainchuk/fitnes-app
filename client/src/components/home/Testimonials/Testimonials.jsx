import { motion } from "framer-motion";
import SectionTitle from "../../common/SectionTitle/SectionTitle.jsx";

const testimonials = [
  { name: "Олена", role: "Відвідувачка групових занять", avatar: "https://i.pravatar.cc/96?img=47", quote: "Мені подобається продуманий розклад: легко знайти заняття, яке пасує до мого дня." },
  { name: "Максим", role: "Прихильник силових тренувань", avatar: "https://i.pravatar.cc/96?img=12", quote: "У клубі комфортно працювати над технікою та поступово рухатися до власних цілей." },
  { name: "Анна", role: "Учасниця йога-практик", avatar: "https://i.pravatar.cc/96?img=32", quote: "Ціную спокійну атмосферу й уважність тренерів під час кожного заняття." },
];

export default function Testimonials() {
  return <section className="section-block" aria-labelledby="testimonials-title">
    <SectionTitle eyebrow="Відгуки" title="Враження учасників Sportlend" description="Досвід людей, які обрали регулярний рух і турботу про себе." />
    <div className="card-grid testimonials-grid">
      {testimonials.map((item, index) => <motion.article key={item.name} className="info-card testimonial-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }} whileHover={{ y: -4 }}>
        <div className="testimonial-person"><img className="testimonial-avatar" src={item.avatar} alt={`Фото ${item.name}`} width="48" height="48" /><div><h3>{item.name}</h3><p>{item.role}</p></div></div>
        <p className="quote">«{item.quote}»</p>
      </motion.article>)}
    </div>
  </section>;
}

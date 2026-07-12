import { Flame, Sparkles, ShieldCheck } from "lucide-react";
import SectionTitle from "../../common/SectionTitle/SectionTitle.jsx";

const items = [
  {
    icon: Flame,
    title: "Професійні тренери",
    text: "Індивідуальний підхід, техніка та мотивація на кожному занятті.",
  },
  {
    icon: Sparkles,
    title: "Сучасне обладнання",
    text: "Преміум зали з найсвіжішею технікою для силових і кардіо тренувань.",
  },
  {
    icon: ShieldCheck,
    title: "Гнучкі абонементи",
    text: "Оберіть формат під свій стиль життя без зайвого стресу.",
  },
];

export default function Benefits() {
  return (
    <section className="section-block">
      <SectionTitle
        eyebrow="Чому LimeFit"
        title="Фітнес, який дійсно працює на результат"
        description="Комфорт, індивідуальність і професійність у кожній деталі."
      />
      <div className="feature-grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="feature-card">
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

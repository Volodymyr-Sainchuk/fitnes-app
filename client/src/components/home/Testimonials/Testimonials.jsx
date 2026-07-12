import SectionTitle from "../../common/SectionTitle/SectionTitle.jsx";

const testimonials = [
  {
    name: "Олена",
    quote: "Нарешті знайшла клуб, де комфортно тренуватися навіть у щоденному графіку.",
  },
  {
    name: "Максим",
    quote: "Після тренувань з LimeFit я відчуваю себе сильніше, впевненіше і спокійніше.",
  },
  {
    name: "Аня",
    quote: "Атмосфера, тренери та розклад — усе на найвищому рівні.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-block">
      <SectionTitle
        eyebrow="Відгуки"
        title="Ті, хто вже обрав LimeFit"
        description="Наша спільнота росте завдяки впевненому результату й підтримці."
      />
      <div className="card-grid testimonials-grid">
        {testimonials.map((item) => (
          <article key={item.name} className="info-card">
            <p className="quote">“{item.quote}”</p>
            <p className="accent-text">{item.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

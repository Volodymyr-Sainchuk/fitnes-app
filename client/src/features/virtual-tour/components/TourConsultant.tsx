import { useMemo, useState } from "react";

type TourConsultantProps = {
  roomTitle: string;
  onBookMembership: () => void;
  onViewSchedule: () => void;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

function buildAssistantReply(input: string, roomTitle: string): string {
  const normalized = input.toLowerCase();

  if (normalized.includes("абон") || normalized.includes("membership")) {
    return "Рекомендую перейти у Memberships: там доступні персональні та клубні плани, а також акції для нових гостей.";
  }

  if (normalized.includes("розклад") || normalized.includes("schedule") || normalized.includes("клас")) {
    return "Розклад групових занять доступний у розділі Classes. Можу підказати формати для вашого рівня підготовки.";
  }

  if (normalized.includes("сауна") || normalized.includes("віднов")) {
    return "Сауна і recovery-зони найзручніше відвідати після силового або кардіо тренування. Я можу показати шлях на мапі.";
  }

  return `Ви зараз у зоні ${roomTitle}. Поставте питання про абонементи, тренерів або розклад, і я підкажу найкращий маршрут.`;
}

export default function TourConsultant({ roomTitle, onBookMembership, onViewSchedule }: TourConsultantProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Вітаю у 360° турі SportLand. Я AI-консультант: допоможу з абонементом, розкладом і навігацією по клубу.",
    },
  ]);

  const quickReplies = useMemo(
    () => ["Які є абонементи?", "Покажи розклад групових занять", `Що є в зоні ${roomTitle}?`],
    [roomTitle],
  );

  const submit = (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    setMessages((prev) => {
      const base = prev.length + 1;
      const userMessage: ChatMessage = {
        id: `user-${base}`,
        role: "user",
        text: clean,
      };

      const assistantMessage: ChatMessage = {
        id: `assistant-${base + 1}`,
        role: "assistant",
        text: buildAssistantReply(clean, roomTitle),
      };

      return [...prev, userMessage, assistantMessage];
    });
    setDraft("");
  };

  return (
    <>
      {open ? (
        <section className="pano-tour-consultant-panel" aria-label="AI Consultant">
          <header className="pano-tour-consultant-head">
            <div>
              <p className="section-eyebrow">AI Consultant</p>
              <h3>Віртуальний помічник</h3>
            </div>
            <button type="button" className="button secondary" onClick={() => setOpen(false)}>
              Закрити
            </button>
          </header>

          <div className="pano-tour-consultant-messages">
            {messages.map((message) => (
              <article key={message.id} className={`pano-tour-consultant-message ${message.role}`}>
                <p>{message.text}</p>
              </article>
            ))}
          </div>

          <div className="pano-tour-consultant-quick-actions">
            {quickReplies.map((reply) => (
              <button key={reply} type="button" className="pano-tour-chip" onClick={() => submit(reply)}>
                {reply}
              </button>
            ))}
          </div>

          <div className="pano-tour-consultant-footer">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Поставте запитання..."
              rows={3}
            />
            <div className="pano-tour-consultant-footer-actions">
              <button type="button" className="button secondary" onClick={onViewSchedule}>
                View Schedule
              </button>
              <button type="button" className="button primary" onClick={onBookMembership}>
                Book Membership
              </button>
              <button type="button" className="button primary" onClick={() => submit(draft)}>
                Send
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        className="pano-tour-consultant-fab"
        onClick={() => setOpen((value) => !value)}
        aria-label="Відкрити AI консультанта"
      >
        AI Consultant
      </button>
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronDown, MessageCircleMore, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { consultantKnowledge } from "../../../data/consultantKnowledge.js";

const starterMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Привіт. Я консультант Sportlend. Можу підказати про абонементи, тренерів, заняття та контакти клубу.",
  },
];

const quickQuestions = ["Які є абонементи?", "Хто у вас тренери?", "Яка адреса і графік?", "Які є заняття?"];

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function buildResponse(message) {
  const text = normalizeText(message);

  if (!text) {
    return "Напишіть коротке питання, і я підкажу по клубу.";
  }

  if (/(цін|варт|тариф|абонем|план|membership)/.test(text)) {
    const plans = consultantKnowledge.memberships
      .map((plan) => `${plan.name} — ${plan.price}, ${plan.duration}: ${plan.description}`)
      .join("\n");
    return `Ось абонементи Sportlend:\n${plans}`;
  }

  if (/(тренер|тренери|коуч)/.test(text)) {
    const trainers = consultantKnowledge.trainers
      .map((trainer) => `${trainer.name} — ${trainer.specialization}`)
      .join("\n");
    return `У клубі є такі тренери:\n${trainers}`;
  }

  if (/(адрес|контакт|телефон|email|пошта|графік|час|відкрит)/.test(text)) {
    return [
      `Адреса: ${consultantKnowledge.address}`,
      `Графік: ${consultantKnowledge.hours}`,
      `Телефон: ${consultantKnowledge.phone}`,
      `Email: ${consultantKnowledge.email}`,
    ].join("\n");
  }

  if (/(зант|занят|клас|розклад|тренув)/.test(text)) {
    return `На сайті доступні напрями:\n${formatList(consultantKnowledge.classes)}`;
  }

  if (/(переваг|чому|benefit|чому sportlend|що є)/.test(text)) {
    return `Ось ключові переваги Sportlend:\n${formatList(consultantKnowledge.benefits)}`;
  }

  if (/(про клуб|опис|спортленд|sportlend|про sportlend)/.test(text)) {
    return consultantKnowledge.summary;
  }

  return [
    "Я можу підказати лише по тому, що вже є на сайті.",
    "Спробуйте спитати про абонементи, тренерів, заняття, адресу або графік.",
  ].join(" ");
}

export default function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isThinking]);

  const headerSubtitle = useMemo(() => {
    if (isThinking) return "Підбираю відповідь з даних сайту...";
    return "Відповіді тільки на основі контенту Sportlend";
  }, [isThinking]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isThinking) return;

    const userMessage = { id: Date.now(), role: "user", text };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      const reply = buildResponse(text);
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", text: reply }]);
      setIsThinking(false);
    }, 450);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const resetConversation = () => {
    setMessages(starterMessages);
    setInput("");
    setIsThinking(false);
  };

  if (!isOpen) {
    return (
      <button
        className="consultant-launcher"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Відкрити AI консультанта"
      >
        <span className="consultant-launcher-icon">
          <MessageCircleMore size={18} />
        </span>
        <span>
          <strong>AI Consultant</strong>
          <small>Sportlend</small>
        </span>
      </button>
    );
  }

  return (
    <section className={`consultant-panel ${isMinimized ? "is-minimized" : ""}`} aria-label="AI консультант Sportlend">
      <header className="consultant-header">
        <div className="consultant-title">
          <span className="consultant-badge">
            <Sparkles size={14} />
          </span>
          <div>
            <strong>AI Consultant</strong>
            <p>{headerSubtitle}</p>
          </div>
        </div>
        <div className="consultant-actions">
          <button
            type="button"
            className="consultant-icon-button"
            onClick={() => setIsMinimized((current) => !current)}
            aria-label="Згорнути або розгорнути"
          >
            <ChevronDown size={16} />
          </button>
          <button
            type="button"
            className="consultant-icon-button"
            onClick={resetConversation}
            aria-label="Очистити історію"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            className="consultant-icon-button"
            onClick={() => setIsOpen(false)}
            aria-label="Закрити консультанта"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {!isMinimized ? (
        <>
          <div className="consultant-messages" ref={scrollRef}>
            {messages.map((message) => (
              <article key={message.id} className={`consultant-message ${message.role}`}>
                {message.role === "assistant" ? <Bot size={16} /> : null}
                <p>{message.text}</p>
              </article>
            ))}
            {isThinking ? (
              <article className="consultant-message assistant typing">
                <Bot size={16} />
                <p>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </p>
              </article>
            ) : null}
          </div>

          <div className="consultant-suggestions" aria-label="Швидкі запитання">
            {quickQuestions.map((question) => (
              <button key={question} type="button" onClick={() => setInput(question)}>
                {question}
              </button>
            ))}
          </div>

          <div className="consultant-composer">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишіть своє питання..."
              rows={3}
            />
            <button
              type="button"
              className="consultant-send"
              onClick={() => void sendMessage()}
              disabled={isThinking || !input.trim()}
            >
              <Send size={16} />
              Надіслати
            </button>
          </div>
        </>
      ) : (
        <div className="consultant-collapsed">
          <p>Консультант згорнуто. Натисніть кнопку зверху, щоб продовжити чат.</p>
        </div>
      )}
    </section>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, Users } from "lucide-react";
import BookingButton from "../BookingForm/BookingForm.jsx";
import Modal from "../../common/Modal/Modal.jsx";
import Button from "../../common/Button/Button.jsx";

export default function ClassCard({ item, onBooked }) {
  const trainerName = item?.trainer?.user?.name || "Команда";
  const [open, setOpen] = useState(false);
  const date = new Date(item.dateTime).toLocaleString("uk-UA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.article className="info-card class-card" whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <div className="card-top">
        <p className="section-eyebrow">{item.title}</p>
        <span className="pill">{item.duration} хв</span>
      </div>
      <p>{item.description}</p>
      <div className="class-meta">
        <span>
          <CalendarDays size={16} /> {date}
        </span>
        <span>
          <Clock3 size={16} /> {item.duration} хв
        </span>
        <span>
          <Users size={16} /> {item.capacity} місць
        </span>
      </div>
      <p className="accent-text">Тренер: {trainerName}</p>
      <div className="button-row">
        <BookingButton classId={item.id} onBooked={onBooked} />
        <Button variant="secondary" className="card-detail-button" onClick={() => setOpen(true)}>
          Детальніше
        </Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={item.title} size="wide">
        <div className="detail-stack">
          <p>{item.description || "Заняття для всіх рівнів підготовки."}</p>
          <div className="detail-meta">
            <span>
              <CalendarDays size={14} /> {date}
            </span>
            <span>
              <Clock3 size={14} /> {item.duration} хв
            </span>
            <span>
              <Users size={14} /> {item.capacity} місць
            </span>
          </div>
          <p className="accent-text">Тренер: {trainerName}</p>
          <div className="button-row">
            <BookingButton
              classId={item.id}
              onBooked={() => {
                if (onBooked) onBooked();
                setOpen(false);
              }}
            />
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Закрити
            </Button>
          </div>
        </div>
      </Modal>
    </motion.article>
  );
}

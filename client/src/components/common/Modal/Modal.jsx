import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, size = "normal" }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <motion.div
        ref={dialogRef}
        className={`info-card modal-card ${size === "wide" ? "modal-card-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="icon-link" onClick={onClose} aria-label="Закрити">
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

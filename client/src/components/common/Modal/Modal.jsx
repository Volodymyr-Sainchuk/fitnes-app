import { memo, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function Modal({ open, onClose, title, children, size = "normal" }) {
  const dialogRef = useRef(null);
  const lastActiveElementRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleClose = useCallback(() => {
    onCloseRef.current?.();
  }, []);

  useEffect(() => {
    if (!open) return;

    lastActiveElementRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const frame = window.requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.body.classList.remove("modal-open");

      if (lastActiveElementRef.current instanceof HTMLElement) {
        lastActiveElementRef.current.focus();
      }
    };
  }, [open, handleClose]);

  if (!open) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      <motion.div
        className="modal-backdrop"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={handleClose}
        role="presentation"
      >
        <motion.div
          ref={dialogRef}
          className={`info-card modal-card ${size === "wide" ? "modal-card-wide" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          initial={false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal-head">
            <h3>{title}</h3>
            <button type="button" className="icon-link" onClick={handleClose} aria-label="Закрити">
              <X size={16} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}

export default memo(Modal);

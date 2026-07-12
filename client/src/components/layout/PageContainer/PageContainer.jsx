import { motion } from "framer-motion";

export default function PageContainer({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="page-shell"
    >
      {children}
    </motion.main>
  );
}

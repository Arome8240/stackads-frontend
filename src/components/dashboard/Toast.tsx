"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TickCircle, CloseCircle, InfoCircle } from "iconsax-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const config = {
  success: {
    icon: <TickCircle size={18} color="#4ade80" variant="Bold" />,
    border: "border-[#4ade80]/20",
    text: "text-[#4ade80]",
  },
  error: {
    icon: <CloseCircle size={18} color="#f87171" variant="Bold" />,
    border: "border-red-500/20",
    text: "text-red-400",
  },
  info: {
    icon: <InfoCircle size={18} color="#a855f7" variant="Bold" />,
    border: "border-[#a855f7]/20",
    text: "text-[#a855f7]",
  },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const c = config[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl glass border ${c.border} shadow-xl`}
      >
        {c.icon}
        <span className="text-sm text-white/80">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/30 hover:text-white"
        >
          <CloseCircle size={16} color="#ffffff80" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TickCircle, CloseCircle, InfoCircle, Warning2 } from "iconsax-react";
import type { ToastType } from "@/types";
import { TOAST_DURATION } from "@/lib/constants";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const config: Record<
  ToastType,
  { icon: JSX.Element; border: string; text: string }
> = {
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
  warning: {
    icon: <Warning2 size={18} color="#fbbf24" variant="Bold" />,
    border: "border-[#fbbf24]/20",
    text: "text-[#fbbf24]",
  },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, TOAST_DURATION);
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

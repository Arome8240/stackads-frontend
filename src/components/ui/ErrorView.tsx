"use client";
import { Warning2 } from "iconsax-react";

interface ErrorViewProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-6">
      <div className="glass rounded-2xl p-8 border border-red-500/20 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Warning2 size={28} color="#f87171" variant="Bold" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-white/50 mb-6 leading-relaxed">
          {message ||
            "An unexpected error occurred. This has been logged and we'll look into it."}
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

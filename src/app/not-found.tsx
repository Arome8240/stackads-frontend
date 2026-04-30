import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | StackAds",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-6">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#f7931a]/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-[#a855f7]/8 blur-[100px] pointer-events-none" />

      <div className="relative text-center max-w-lg">
        {/* 404 number */}
        <p
          className="text-[120px] md:text-[160px] font-bold leading-none tracking-tighter"
          style={{
            background: "linear-gradient(135deg, #f7931a, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">
          Page not found
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full glass border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

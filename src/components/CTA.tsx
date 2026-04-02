"use client";
import { motion } from "framer-motion";
import { ArrowRight, DocumentText } from "iconsax-react";

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#f7931a]/8 via-transparent to-[#a855f7]/8 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#f7931a]/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-12 md:p-16 border border-white/10 orange-glow"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f7931a]/10 text-[#f7931a] text-xs font-medium border border-[#f7931a]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f7931a] animate-pulse" />
            Now in Public Beta
          </span>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Start Monetizing <span className="gradient-text">Today</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Join thousands of developers already earning with StackAds. Set up
            in minutes, earn forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black font-bold text-base hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ArrowRight size={20} color="#000000" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full glass text-white font-semibold text-base hover:bg-white/10 transition-colors border border-white/10"
            >
              <DocumentText size={20} color="#f0f0f5" />
              View Docs
            </motion.a>
          </div>

          <p className="mt-6 text-xs text-white/30">
            No credit card required. Free tier available for all publishers.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

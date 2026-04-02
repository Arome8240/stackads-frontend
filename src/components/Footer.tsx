"use client";
import { motion } from "framer-motion";
import { DocumentText, Code, Global } from "iconsax-react";

const links = {
  Product: ["Features", "How It Works", "Pricing", "Changelog"],
  Developers: ["Documentation", "SDK Reference", "GitHub", "Status"],
  Company: ["About", "Blog", "Careers", "Contact"],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-t from-[#a855f7]/3 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg">StackAds</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              The decentralized advertising network for Web2 and Web3.
              Transparent, instant, and built on Stacks.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                aria-label="Documentation"
                className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <DocumentText size={16} color="#f7931a" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <Code size={16} color="#a855f7" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <Global size={16} color="#22d3ee" />
              </a>
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items], i) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.08 }}
            >
              <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} StackAds. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

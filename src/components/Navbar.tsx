"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { HambergerMenu, CloseCircle } from "iconsax-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight">StackAds</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Sign In
          </a>
          <a
            href="#"
            className="text-sm font-semibold px-5 py-2 rounded-full bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black hover:opacity-90 transition-opacity"
          >
            Get Started
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <CloseCircle size={24} color="#f7931a" />
          ) : (
            <HambergerMenu size={24} color="#f0f0f5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-white/10 px-6 py-4 flex flex-col gap-4"
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#"
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-linear-to-r from-[#f7931a] to-[#e8820a] text-black text-center"
          >
            Get Started
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}

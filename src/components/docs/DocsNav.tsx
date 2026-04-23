"use client";
import Link from "next/link";
import { SearchNormal1 } from "iconsax-react";

export default function DocsNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#0d0d1a]/80 backdrop-blur-md">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-base">StackAds</span>
            <span className="text-xs text-white/40 ml-2">/ Docs</span>
          </Link>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <SearchNormal1
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                placeholder="Search docs..."
                className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#f7931a] transition-colors"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white/10 rounded text-xs text-white/40">
                ⌘K
              </kbd>
            </div>

            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#f7931a] text-white rounded-lg hover:bg-[#f7931a]/90 transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

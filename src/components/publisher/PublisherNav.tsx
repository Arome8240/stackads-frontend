"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Notification,
  SearchNormal1,
  HambergerMenu,
  CloseCircle,
  Home2,
  Monitor,
  PresentionChart,
  DollarCircle,
  Setting2,
  LogoutCurve,
} from "iconsax-react";

const navItems = [
  { label: "Overview", href: "/publisher", icon: <Home2 size={20} /> },
  {
    label: "Ad Units",
    href: "/publisher/ad-units",
    icon: <Monitor size={20} />,
  },
  {
    label: "Analytics",
    href: "/publisher/analytics",
    icon: <PresentionChart size={20} />,
  },
  {
    label: "Earnings",
    href: "/publisher/earnings",
    icon: <DollarCircle size={20} />,
  },
  {
    label: "Settings",
    href: "/publisher/settings",
    icon: <Setting2 size={20} />,
  },
];

const pageTitles: Record<string, string> = {
  "/publisher": "Overview",
  "/publisher/ad-units": "Ad Units",
  "/publisher/analytics": "Analytics",
  "/publisher/earnings": "Earnings",
  "/publisher/settings": "Settings",
};

export default function PublisherNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0d0d1a]/80 backdrop-blur-md border-b border-white/8">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HambergerMenu size={22} color="#f0f0f5" />
          </button>
          <h1 className="text-base font-semibold text-white">
            {pageTitles[pathname] ?? "Publisher"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center hover:text-white transition-colors">
            <SearchNormal1 size={16} color="#a855f7" />
          </button>
          <button className="relative w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center hover:text-white transition-colors">
            <Notification size={16} color="#4ade80" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4ade80]" />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#4ade80] to-[#22d3ee] flex items-center justify-center text-xs font-bold text-black">
              P
            </div>
            <span className="hidden sm:block text-sm font-medium text-white/70">
              Publisher
            </span>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0d0d1a] border-r border-white/8 flex flex-col">
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <div>
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="font-bold text-base">StackAds</span>
                </Link>
                <span className="mt-1 inline-block text-[10px] font-semibold text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-2 py-0.5 rounded-full">
                  Publisher
                </span>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <CloseCircle size={22} color="#f87171" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-[#4ade80]/10 text-[#4ade80]" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                  >
                    <span
                      className={active ? "text-[#4ade80]" : "text-white/40"}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-white/8">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogoutCurve size={20} color="#f87171" />
                Back to Site
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

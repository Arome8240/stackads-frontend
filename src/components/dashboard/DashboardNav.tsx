"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Notification,
  SearchNormal1,
  Home2,
  Chart,
  AddCircle,
  PresentionChart,
  EmptyWallet,
  HambergerMenu,
  CloseCircle,
  LogoutCurve,
} from "iconsax-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: <Home2 size={20} /> },
  {
    label: "Campaigns",
    href: "/dashboard/campaigns",
    icon: <Chart size={20} />,
  },
  {
    label: "Create Campaign",
    href: "/dashboard/create",
    icon: <AddCircle size={20} />,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <PresentionChart size={20} />,
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    icon: <EmptyWallet size={20} />,
  },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/campaigns": "Campaigns",
  "/dashboard/create": "Create Campaign",
  "/dashboard/analytics": "Analytics",
  "/dashboard/wallet": "Wallet",
};

export default function DashboardNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0d0d1a]/80 backdrop-blur-md border-b border-white/8">
        {/* Mobile menu button + page title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <HambergerMenu size={22} color="#f0f0f5" />
          </button>
          <h1 className="text-base font-semibold text-white">
            {pageTitles[pathname] ?? "Dashboard"}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <SearchNormal1 size={16} color="#a855f7" />
          </button>
          <button className="relative w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <Notification size={16} color="#f7931a" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f7931a]" />
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <span className="hidden sm:block text-sm font-medium text-white/70">
              Advertiser
            </span>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0d0d1a] border-r border-white/8 flex flex-col">
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#f7931a] to-[#a855f7] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-bold text-base">StackAds</span>
              </Link>
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#f7931a]/15 text-[#f7931a]"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={active ? "text-[#f7931a]" : "text-white/40"}
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

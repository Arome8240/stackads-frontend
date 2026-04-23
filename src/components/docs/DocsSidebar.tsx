"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home2, 
  Code, 
  Book, 
  Shield, 
  DocumentText,
  Setting2 
} from "iconsax-react";

const navigation = [
  {
    title: "Getting Started",
    icon: <Home2 size={18} />,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/getting-started" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Core Concepts", href: "/docs/concepts" },
    ],
  },
  {
    title: "SDK Reference",
    icon: <Code size={18} />,
    items: [
      { title: "Core SDK", href: "/docs/sdk/core" },
      { title: "React", href: "/docs/sdk/react" },
      { title: "Next.js", href: "/docs/sdk/nextjs" },
      { title: "Vue", href: "/docs/sdk/vue" },
      { title: "Angular", href: "/docs/sdk/angular" },
      { title: "Svelte", href: "/docs/sdk/svelte" },
      { title: "Vanilla JS", href: "/docs/sdk/vanilla" },
    ],
  },
  {
    title: "Smart Contracts",
    icon: <Shield size={18} />,
    items: [
      { title: "Overview", href: "/docs/smart-contracts" },
      { title: "Token Contract", href: "/docs/smart-contracts/token" },
      { title: "Registry", href: "/docs/smart-contracts/registry" },
      { title: "Staking", href: "/docs/smart-contracts/staking" },
      { title: "Treasury", href: "/docs/smart-contracts/treasury" },
      { title: "Governance", href: "/docs/smart-contracts/governance" },
    ],
  },
  {
    title: "Guides",
    icon: <Book size={18} />,
    items: [
      { title: "Publisher Guide", href: "/docs/guides/publisher" },
      { title: "Advertiser Guide", href: "/docs/guides/advertiser" },
      { title: "Integration Guide", href: "/docs/guides/integration" },
      { title: "Best Practices", href: "/docs/guides/best-practices" },
    ],
  },
  {
    title: "API Reference",
    icon: <DocumentText size={18} />,
    items: [
      { title: "REST API", href: "/docs/api/rest" },
      { title: "GraphQL API", href: "/docs/api/graphql" },
      { title: "Webhooks", href: "/docs/api/webhooks" },
    ],
  },
  {
    title: "Advanced",
    icon: <Setting2 size={18} />,
    items: [
      { title: "Testing", href: "/docs/advanced/testing" },
      { title: "Deployment", href: "/docs/advanced/deployment" },
      { title: "Security", href: "/docs/advanced/security" },
      { title: "Troubleshooting", href: "/docs/advanced/troubleshooting" },
    ],
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-white/8 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
      <nav className="p-6 space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/40">{section.icon}</span>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-[#f7931a]/15 text-[#f7931a] font-medium"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

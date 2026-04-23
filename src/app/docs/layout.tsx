import { ReactNode } from "react";
import DocsNav from "@/components/docs/DocsNav";
import DocsSidebar from "@/components/docs/DocsSidebar";

export const metadata = {
  title: "Documentation - StackAds",
  description: "Complete documentation for StackAds platform and SDKs",
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07070f]">
      <DocsNav />
      <div className="flex max-w-[1800px] mx-auto">
        <DocsSidebar />
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

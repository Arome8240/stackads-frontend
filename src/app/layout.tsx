import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "StackAds — Decentralized Ad Network for Web2 & Web3",
  description:
    "Monetize your app without limits. The decentralized advertising network powered by the Stacks blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-[#07070f] text-[#f0f0f5] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

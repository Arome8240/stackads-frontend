import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "StackAds — Decentralized Ad Network for Web2 & Web3",
  description:
    "Monetize your app without limits. The decentralized advertising network powered by the Stacks blockchain.",
  other: {
    "talentapp:project_verification":
      "b3b5ea82262cfd106706ad6fa43988b8b6ef1d9d3f5e887bc0ddfe7add91a133e03219c2cca4aecb436f971c41221585a7e81aa853095806982620d85988d6f8",
  },
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

import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import WalletConnect from "@/components/WalletConnect";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scholar.AI",
  description: "Autonomous Research Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <Providers>
          <Sidebar />
          <div className="min-h-screen">
            <main className="min-h-screen">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

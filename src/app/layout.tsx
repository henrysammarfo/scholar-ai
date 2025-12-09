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
          <div className="lg:pl-72 transition-all duration-300 min-h-screen">
            <header className="fixed top-0 left-0 lg:left-72 right-0 z-10 p-6 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
              <div className="text-xl font-bold text-gray-900 pointer-events-auto">
                Scholar.AI
              </div>
              <div className="pointer-events-auto">
                <WalletConnect />
              </div>
            </header>
            <main className="pt-20 lg:pt-0 min-h-screen">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

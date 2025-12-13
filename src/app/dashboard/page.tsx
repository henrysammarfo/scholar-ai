"use client";

import ResearchInterface from "@/components/ResearchInterface";
import { Sidebar } from "@/components/Sidebar";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { isConnected, isConnecting } = useAccount();
    const router = useRouter();

    // Protect the route
    useEffect(() => {
        if (!isConnected && !isConnecting) {
            router.push("/");
        }
    }, [isConnected, isConnecting, router]);

    if (isConnecting) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    if (!isConnected) return null;

    return (
        <div className="flex h-screen bg-white">
            {/* Left Sidebar */}
            <div className="hidden lg:block w-[260px] flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 h-full relative overflow-hidden bg-white">
                {/* Mobile Sidebar Logic handled inside Sidebar component's mobile view if needed 
                    but for now sticking to desktop first or standard sidebar toggle */}
                <div className="lg:hidden">
                    <Sidebar />
                </div>

                <ResearchInterface />
            </main>
        </div>
    );
}

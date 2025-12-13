"use client";

import { useSession } from "@/context/SessionContext";
import { useAccount, useDisconnect } from "wagmi";
import { MessageSquarePlus, Clock, Settings, LogOut, MessageSquare, Trash2, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const { sessions, currentSessionId, createSession, switchSession, deleteSession } = useSession();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (!isConnected) return null;

    const handleCreateSession = () => {
        createSession();
        if (pathname !== "/dashboard") {
            router.push("/dashboard");
        }
    };

    const handleSwitchSession = (id: string) => {
        switchSession(id);
        if (pathname !== "/dashboard") {
            router.push("/dashboard");
        }
    };

    const handleLogout = () => {
        disconnect();
        router.push("/");
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-sm"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar Container */}
            {/* Sidebar Container */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 h-full w-[260px] bg-[#171717] text-gray-100 z-40 flex flex-col transition-transform font-sans",
                    "transform lg:transform-none lg:relative", // on lg, make it relative and reset transform
                    !isOpen && "-translate-x-full lg:translate-x-0" // hidden on mobile if closed, visible on lg
                )}
            >
                {/* New Chat Button */}
                <div className="p-3">
                    <button
                        onClick={handleCreateSession}
                        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-[#212121] rounded-lg transition-colors border border-white/10 text-sm"
                    >
                        <div className="p-1 bg-white text-black rounded-full">
                            <MessageSquarePlus className="w-4 h-4" />
                        </div>
                        <span className="font-medium">New Research</span>
                    </button>
                </div>

                {/* Session List */}
                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
                    <div className="text-xs font-semibold text-gray-500 px-3 py-2">Previous 7 Days</div>
                    {sessions.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500 text-sm italic">
                            No history yet.
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => handleSwitchSession(session.id)}
                                className={clsx(
                                    "w-full text-left px-4 py-3 rounded-xl transition-all border group relative",
                                    currentSessionId === session.id
                                        ? "bg-white text-gray-900 shadow-sm border-gray-200"
                                        : "text-gray-400 hover:bg-[#212121] border-transparent hover:text-gray-200"
                                )}
                            >
                                <div className="font-medium truncate pr-6 text-sm">{session.title || "New Conversation"}</div>
                                {session.lastUpdated && (
                                    <div className="text-[10px] opacity-60 mt-1">
                                        {new Date(session.lastUpdated).toLocaleDateString()}
                                    </div>
                                )}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSession(session.id);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all text-gray-500"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* User / Footer */}
                <div className="p-3 border-t border-white/10 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 w-full hover:bg-[#212121] rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-black">
                            {address ? address.slice(0, 2).toUpperCase() : "U"}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                            <div className="font-medium truncate text-xs">
                                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not Connected"}
                            </div>
                            <div className="text-[10px] text-gray-500">Free Plan</div>
                        </div>
                        <LogOut className="w-4 h-4 ml-auto" />
                    </button>
                    <div className="text-[10px] text-gray-600 text-center mt-2">
                        Scholar.AI v1.2 • Gemini Powered
                    </div>
                </div>
            </aside>
        </>
    );
}

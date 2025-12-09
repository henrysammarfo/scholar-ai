"use client";

import { useSession } from "@/context/SessionContext";
import { useAccount } from "wagmi";
import { MessageSquarePlus, Trash2, Github, MessageSquare, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export function Sidebar() {
    const { sessions, currentSessionId, createSession, switchSession, deleteSession } = useSession();
    const { isConnected } = useAccount();
    const [isOpen, setIsOpen] = useState(false);

    if (!isConnected) return null;

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-100 rounded-md shadow-sm"
            >
                <Menu className="w-6 h-6 text-gray-800" />
            </button>

            {/* Sidebar Container */}
            <motion.div
                initial={{ x: -280 }}
                animate={{ x: isOpen ? 0 : -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={clsx(
                    "fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 z-40 flex flex-col transition-transform",
                    "shadow-xl lg:translate-x-0 lg:shadow-none"
                )}
            >
                {/* Header */}
                <div className="p-4 pt-20 lg:pt-4 border-b border-gray-100">
                    <button
                        onClick={createSession}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm text-gray-900 font-medium"
                    >
                        <MessageSquarePlus className="w-5 h-5 text-blue-600" />
                        New Research
                    </button>
                </div>

                {/* Session List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sessions.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            No history yet. Start a search!
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => switchSession(session.id)}
                                className={clsx(
                                    "group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all",
                                    currentSessionId === session.id
                                        ? "bg-white shadow-sm border border-gray-200"
                                        : "hover:bg-gray-100 border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <MessageSquare
                                        className={clsx(
                                            "w-4 h-4 flex-shrink-0",
                                            currentSessionId === session.id ? "text-blue-600" : "text-gray-400"
                                        )}
                                    />
                                    <span className={clsx(
                                        "truncate text-sm font-medium",
                                        currentSessionId === session.id ? "text-gray-900" : "text-gray-600"
                                    )}>
                                        {session.title || "Untitled Research"}
                                    </span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSession(session.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 px-2 py-2 text-sm text-gray-500">
                        <Github className="w-4 h-4" />
                        <span>Scholar.AI v1.0</span>
                    </div>
                </div>
            </motion.div>

            {/* Spacer for Main Content when Sidebar is visible (Desktop only) */}
            <div className={clsx(
                "hidden lg:block transition-all duration-300",
                isOpen ? "w-72" : "w-0"
            )} />
        </>
    );
}

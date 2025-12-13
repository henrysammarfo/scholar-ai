"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, Loader2, StopCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAccount } from "wagmi";
import { useSession } from "@/context/SessionContext";

export default function ResearchInterface({ isDemo = false }: { isDemo?: boolean }) {
    const { isConnected, address } = useAccount();
    const { currentSessionId, sessions, addMessage, createSession } = useSession();
    const [topic, setTopic] = useState("");
    const [mode, setMode] = useState<"research" | "exam">("research");
    const [status, setStatus] = useState<"idle" | "loading" | "complete" | "error">("idle");
    const [steps, setSteps] = useState<string[]>([]);

    const endRef = useRef<HTMLDivElement>(null);
    const session = sessions.find(s => s.id === currentSessionId);

    // Messages for display (fallback to empty array if no session)
    const messages = session?.messages || [];

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, status, steps]);

    // Auto-create session on mount if needed (skip if demo, unless we want to force it)
    // Auto-create removed to prevent empty sessions on every login
    // Session will be created when the user actually sends a message

    const handleResearch = async () => {
        if (!topic.trim()) return;

        // Block API calls in Demo mode
        if (isDemo) {
            setTopic(""); // Just clear it for "play" effect
            // Optional: You could show a toast here "Connect wallet to research"
            return;
        }

        if (!isConnected) return;

        let targetSessionId = currentSessionId;

        // Ensure session exists
        if (!targetSessionId) {
            targetSessionId = createSession();
        }

        const sessionIdToUse = targetSessionId;

        // If we still have no session ID (e.g. disconnected demo), we might skip addMessage to context?
        // But for UI feedback, we probably want to show it.
        if (sessionIdToUse) {
            addMessage(sessionIdToUse, {
                role: "user",
                content: topic,
                timestamp: Date.now(),
                type: "text"
            });
        }

        const userQuery = topic;
        setTopic("");
        setStatus("loading");
        setSteps(["Initializing specialized agents...", `Searching knowledge base for: ${userQuery.slice(0, 30)}...`]);
        const timer1 = setTimeout(() => setSteps(s => [...s, "Synthesizing findings..."]), 2500);

        try {
            const res = await fetch("/api/research", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-wallet-address": address || ""
                },
                body: JSON.stringify({ message: userQuery, mode, walletAddress: address }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 429) {
                    const retryAfter = errorData.retryAfter || 60;
                    throw new Error(`Rate limit exceeded. Try again in ${retryAfter}s.`);
                }
                throw new Error(errorData.error || "Research failed");
            }

            const data = await res.json();
            const finalSessionId = currentSessionId || sessionIdToUse;

            if (finalSessionId) {
                addMessage(finalSessionId, {
                    role: "agent",
                    content: data.response,
                    timestamp: Date.now(),
                    type: "report"
                });
            }

            setStatus("idle");
        } catch (e: any) {
            console.error(e);
            setStatus("error");
            const finalSessionId = currentSessionId || sessionIdToUse;
            if (finalSessionId) {
                addMessage(finalSessionId, {
                    role: "agent",
                    content: e.message || "An unexpected error occurred.",
                    timestamp: Date.now(),
                    type: "error"
                });
            }
        } finally {
            clearTimeout(timer1);
        }
    };

    return (
        <div className={`flex flex-col h-full relative w-full bg-white text-gray-800 ${isDemo ? 'rounded-b-[2rem]' : ''}`}>
            {/* Chat Area */}
            <div className={`flex-1 overflow-y-auto w-full p-4 md:p-6 ${isDemo ? 'pb-20' : 'pb-40'} scrollbar-none`}>
                <style jsx>{`
                    .scrollbar-none::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-none {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
                <div className="max-w-3xl mx-auto space-y-8">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 opacity-0 animate-fadeIn" style={{ animationFillMode: 'forwards' }}>
                            <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                                <Sparkles className="w-8 h-8 text-gray-900" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {isDemo ? "Try the demo" : "How can I help you research today?"}
                            </h2>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={i}
                                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {/* Agent Avatar */}
                                {msg.role === "agent" && (
                                    <div className="w-8 h-8 rounded-sm bg-green-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm">
                                        AI
                                    </div>
                                )}

                                <div className={`max-w-[85%] leading-relaxed ${msg.role === "user"
                                    ? "bg-gray-100 rounded-3xl py-3 px-5 text-gray-900"
                                    : "bg-white border border-gray-100 rounded-3xl py-4 px-6 shadow-sm text-gray-900 w-full"
                                    }`}>
                                    {msg.role === "user" ? (
                                        <p>{msg.content}</p>
                                    ) : (
                                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-p:leading-7">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>

                                {/* User Avatar */}
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-sm bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 font-bold text-xs">
                                        U
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                    {status === "loading" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4 justify-start"
                        >
                            <div className="w-8 h-8 rounded-sm bg-green-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm animate-pulse">
                                AI
                            </div>
                            <div className="max-w-[85%] space-y-2">
                                <div className="bg-white border border-gray-100 rounded-3xl py-4 px-6 shadow-sm text-gray-900 w-full">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                        Thinking Process
                                    </div>
                                    <div className="space-y-1">
                                        {steps.map((step, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-2 text-sm text-gray-500"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                {step}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={endRef} className="h-32" />
                </div>
            </div>

            {/* Input Area - Conditional Positioning */}
            <div className={isDemo
                ? "absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100/50"
                : "fixed bottom-0 left-[260px] right-0 bg-white/80 backdrop-blur-md p-4 pb-6 z-20"
            }>
                <div className={`max-w-3xl mx-auto relative bg-white border border-gray-200 shadow-xl rounded-3xl overflow-hidden focus-within:border-gray-300 focus-within:shadow-2xl transition-all ${isDemo ? 'shadow-sm' : ''}`}>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleResearch();
                            }
                        }}
                        disabled={status === "loading"}
                        placeholder={mode === "exam" ? "Ask about any exam topic..." : "Search or ask anything..."}
                        className="w-full max-h-48 min-h-[56px] py-4 pl-6 pr-24 resize-none outline-none text-base text-gray-800 placeholder-gray-400 disabled:opacity-50"
                        rows={1}
                        style={{ minHeight: isDemo ? '48px' : '56px' }}
                    />

                    {/* Action Buttons Group */}
                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        {/* Mode Toggle as a distinct pill button if space permits, or icon */}
                        {!isDemo && (
                            <button
                                onClick={() => setMode(mode === "research" ? "exam" : "research")}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${mode === "exam"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                    }`}
                            >
                                {mode === "research" ? <Search className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                {mode === "research" ? "Research" : "Exam"}
                            </button>
                        )}

                        <button
                            onClick={handleResearch}
                            disabled={!topic.trim() || status === "loading"}
                            className={`p-2 rounded-full transition-all flex items-center justify-center ${topic.trim() ? "bg-black text-white shadow-md hover:bg-gray-800" : "bg-gray-100 text-gray-300"
                                }`}
                        >
                            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                {!isDemo && (
                    <div className="text-center text-xs text-gray-400 mt-2">
                        Scholar.AI can make mistakes. Verify important information.
                    </div>
                )}
            </div>
        </div>
    );
}

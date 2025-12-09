"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, Loader2, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAccount } from "wagmi";
import { useSession } from "@/context/SessionContext";

export default function ResearchInterface() {
    const { isConnected } = useAccount();
    const { currentSessionId, sessions, addMessage, createSession } = useSession();
    const [topic, setTopic] = useState("");
    const [mode, setMode] = useState<"research" | "exam">("research");
    const [status, setStatus] = useState<"idle" | "loading" | "complete" | "error">("idle");
    const [steps, setSteps] = useState<string[]>([]);

    // Auto-scroll to bottom of chat
    const endRef = useRef<HTMLDivElement>(null);
    const session = sessions.find(s => s.id === currentSessionId);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [session?.messages, status]);

    const handleResearch = async () => {
        if (!topic) return;
        if (!isConnected) {
            alert("Please connect your wallet to access Scholar.AI");
            return;
        }

        // Ensure a session exists
        let targetSessionId = currentSessionId;
        if (!targetSessionId) {
            createSession();
            // Since state updates are async, we might not have the ID yet. 
            // In a real app we'd wait or use the return value of createSession.
            // For now, we'll assume the context handles adding the first message to the new session 
            // once it propagates, or we fallback to the first available session.
            // A better pattern would be for createSession to return the ID.
        }

        // Optimistic fallback if strict persistence isn't critical for the very first split-second
        const sessionIdToUse = targetSessionId || sessions[0]?.id;

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

        setSteps(mode === "exam"
            ? ["Loading Exam Syllabus...", "Generating Flashcards...", "Synthesizing Study Guide..."]
            : ["Verifying On-Chain Identity...", "Initializing Agent...", "Connecting to Knowledge Base..."]
        );

        const timer1 = setTimeout(() => setSteps(s => [...s, "Analyzying..."]), 2000);

        try {
            const res = await fetch("/api/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userQuery, mode }),
            });

            if (!res.ok) throw new Error("Research failed");

            const data = await res.json();

            // Refresh ID just in case it was created during wait
            const latestSessionId = currentSessionId || sessions[0]?.id;

            if (latestSessionId) {
                addMessage(latestSessionId, {
                    role: "agent",
                    content: data.response,
                    timestamp: Date.now(),
                    type: "report"
                });
            }

            setStatus("idle");
        } catch (e) {
            console.error(e);
            setStatus("error");
            const latestSessionId = currentSessionId || sessions[0]?.id;
            if (latestSessionId) {
                addMessage(latestSessionId, {
                    role: "agent",
                    content: "Sorry, something went wrong with the research.",
                    timestamp: Date.now(),
                    type: "error"
                });
            }
        } finally {
            clearTimeout(timer1);
        }
    };

    // Auto-create session on mount if none exists
    useEffect(() => {
        if (isConnected && !currentSessionId && sessions.length === 0) {
            createSession();
        }
    }, [isConnected, currentSessionId, sessions.length, createSession]);


    return (
        <div className="flex flex-col h-full relative z-10 w-full max-w-4xl mx-auto p-4">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto mb-32 space-y-6 p-4 scrollbar-hide">
                {session?.messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`p-5 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${msg.role === "user"
                                ? "bg-white text-gray-900 border border-gray-200"
                                : "bg-white/80 text-gray-900 border border-gray-200 backdrop-blur-md"
                            }`}>
                            {msg.type === "report" ? (
                                <div className="prose prose-sm prose-slate max-w-none">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </motion.div>
                ))}

                {status === "loading" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm backdrop-blur text-sm text-gray-600 flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            <div className="flex flex-col">
                                {steps.slice(-1)[0]}
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 lg:left-72 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-20">
                <div className="max-w-4xl mx-auto pointer-events-auto relative transform transition-all hover:scale-[1.01]">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={isConnected ? (mode === "exam" ? "Enter exam topic..." : "Ask Scholar.AI...") : "Connect Wallet to Chat"}
                        className="w-full bg-white shadow-2xl border border-gray-200 rounded-full py-5 pl-8 pr-32 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100/50 transition-all font-medium"
                        onKeyDown={(e) => e.key === "Enter" && handleResearch()}
                        disabled={!isConnected || status === "loading"}
                    />

                    <button
                        onClick={handleResearch}
                        disabled={!topic || !isConnected || status === "loading"}
                        className="absolute right-2 top-2 bottom-2 bg-black hover:bg-gray-800 text-white w-12 h-12 flex items-center justify-center rounded-full transition-all disabled:opacity-50 shadow-lg active:scale-90"
                    >
                        {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                    </button>

                    {/* Mode Toggles */}
                    <div className="absolute right-16 top-3.5 flex gap-2">
                        <button
                            onClick={() => setMode('research')}
                            className={`p-2 rounded-full border transition-all ${mode === 'research' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'}`}
                            title="Research Mode"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setMode('exam')}
                            className={`p-2 rounded-full border transition-all ${mode === 'exam' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-50'}`}
                            title="Exam Cram Mode"
                        >
                            <Sparkles className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

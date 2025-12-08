"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight, Loader2, FileText, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ResearchInterface() {
    const [topic, setTopic] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "complete" | "error">("idle");
    const [result, setResult] = useState("");
    const [steps, setSteps] = useState<string[]>([]);

    const handleResearch = async () => {
        if (!topic) return;
        setStatus("loading");
        setSteps(["Initializing Agent...", "Connecting to Knowledge Base..."]);

        // Simulate steps for UI effect while waiting
        const timer1 = setTimeout(() => setSteps(s => [...s, "Analyzing Topic Context..."]), 2000);
        const timer2 = setTimeout(() => setSteps(s => [...s, "Performing Deep Web Research..."]), 5000);
        const timer3 = setTimeout(() => setSteps(s => [...s, "Synthesizing Reports..."]), 10000);

        try {
            const res = await fetch("/api/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: topic }),
            });

            if (!res.ok) throw new Error("Research failed");

            const data = await res.json();
            setResult(data.response);
            setStatus("complete");
        } catch (e) {
            console.error(e);
            setStatus("error");
        } finally {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="mb-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 mb-4"
                >
                    Scholar.AI
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg"
                >
                    Autonomous Research Agent powered by ADK specific intelligence.
                </motion.p>
            </div>

            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        key="input"
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="What would you like to research today?"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl py-6 pl-12 pr-32 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)] hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.25)]"
                            onKeyDown={(e) => e.key === "Enter" && handleResearch()}
                        />
                        <button
                            onClick={handleResearch}
                            disabled={!topic}
                            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Research <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}

                {status === "loading" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="loading"
                        className="flex flex-col items-center justify-center space-y-8 min-h-[400px]"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
                            <Loader2 className="w-16 h-16 text-purple-400 animate-spin relative z-10" />
                        </div>
                        <div className="space-y-2 text-center">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-gray-400"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>{step}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {status === "complete" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                                Research Report
                            </h2>
                            <button
                                onClick={() => setStatus("idle")}
                                className="text-sm text-gray-500 hover:text-white transition-colors"
                            >
                                New Research
                            </button>
                        </div>
                        <div className="prose prose-invert max-w-none prose-headings:text-purple-300 prose-a:text-blue-400">
                            <ReactMarkdown>{result}</ReactMarkdown>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

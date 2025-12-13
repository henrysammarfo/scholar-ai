"use client";

import WalletConnect from "@/components/WalletConnect";
import ResearchInterface from "@/components/ResearchInterface";
import { GravityZone, PhysicsItem } from "@/components/GravityZone";
import { Sparkles, GraduationCap, Library, BookOpen, Coins, Network, Brain } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 relative">

            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <div className="text-xl font-bold tracking-tighter text-gray-900 pointer-events-auto flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg text-white flex items-center justify-center font-serif text-lg">S</div>
                    Scholar.AI
                </div>
                <div className="pointer-events-auto">
                    <WalletConnect />
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="relative h-[110vh] w-full flex flex-col items-center justify-start pt-32 overflow-hidden border-b border-gray-100">

                {/* Hero Title - Positioned Top Center */}
                <div className="relative z-10 text-center mb-10 px-4">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 pb-2">
                        Agentic Intelligence
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Orchestrating autonomous workflows for deep research.
                    </p>
                </div>

                {/* Physics Background - Lower Layer */}
                <GravityZone>
                    {/* Main UI Element - Lowered */}
                    <PhysicsItem id="hero-ui" x={window.innerWidth / 2} y={window.innerHeight * 0.6} width={900} height={600}>
                        <div className="w-full h-full bg-white/60 backdrop-blur-md border border-white/40 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-black/5 overflow-hidden">
                            {/* Mini version of app as demo */}
                            <div className="w-full h-full flex flex-col bg-white/50 rounded-[2rem] overflow-hidden shadow-inner border border-gray-100">
                                {/* Fake Browser Header */}
                                <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="flex-1 text-center text-xs text-gray-400 font-medium">scholar-agent.ai</div>
                                </div>
                                <div className="flex-1 relative overflow-hidden">
                                    <ResearchInterface isDemo={true} />
                                </div>
                            </div>
                        </div>
                    </PhysicsItem>

                    {/* Floating Icons - Spread out */}
                    <PhysicsItem id="icon-1" x={150} y={300} width={100} height={100} className="rounded-full !bg-blue-50 !border-blue-100 shadow-lg">
                        <Brain className="w-10 h-10 text-blue-600" />
                    </PhysicsItem>

                    <PhysicsItem id="icon-2" x={window.innerWidth - 150} y={400} width={120} height={120} className="rounded-2xl !bg-purple-50 !border-purple-100 shadow-lg">
                        <GraduationCap className="w-12 h-12 text-purple-600" />
                    </PhysicsItem>
                </GravityZone>

                <div className="absolute bottom-10 animate-bounce pointer-events-none text-gray-400 z-10">
                    Scroll to explore patterns
                </div>
            </section>


            {/* --- FEATURES SECTION --- */}
            <section className="py-24 bg-white relative z-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Mastering Agentic Workflows</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Scholar.AI leverages advanced patterns to handle complex, real-world academic tasks.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                <Network className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Orchestrator Patterns</h3>
                            <p className="text-gray-600 leading-relaxed">
                                A central <strong>Orchestrator-Worker</strong> workflow coordinates specialized agents (Gemini, Claude) to execute complex parallel research tasks.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                                <Brain className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Reflection Loops</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Implements the <strong>Evaluator-Optimizer</strong> pattern, where agents critique and refine their own outputs to ensure academic accuracy.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                                <Coins className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Tool Use & Payments</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Agents autonomously use tools and <strong>402 Micro-Payments</strong> to access premium data sources via trusted gateways.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* --- FOOTER --- */}
            <footer className="py-12 border-t border-gray-100 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-xl font-bold text-gray-900">Scholar.AI</div>
                    <div className="flex gap-8 text-sm text-gray-500 font-medium">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">About Google Deepmind</a>
                    </div>
                    <div className="text-gray-400 text-sm">
                        © 2025 Scholar.AI
                    </div>
                </div>
            </footer>

        </div>
    );
}

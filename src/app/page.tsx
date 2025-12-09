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


{/* --- FOOTER --- */ }
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

        </div >
    );
}

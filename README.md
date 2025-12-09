# Scholar.AI: Agentic Intelligence

[![Agent Arena Hackathon](https://img.shields.io/badge/Agent%20Arena-Submission-purple?style=flat-square)](https://dorahacks.io/hackathon/agent-arena)
[![Powered by ADK-TS](https://img.shields.io/badge/Powered%20by-ADK--TS-blue?style=flat-square)](https://adk.iqai.com)

**Scholar.AI** is an autonomous research companion built for the **Agent Arena AI Hackathon**.

It leverages the **IQAI Agent Development Kit (ADK-TS)** to orchestrate a sophisticated "Orchestrator-Worker" workflow where:
1.  **The Orchestrator Agent** decomposes user queries into research plans.
2.  **Specialized Tools** (`iq_wiki_search`, `tavily_search`) execute parallel data gathering.
3.  **The Writer Agent** (Sub-agent) synthesizes findings into academic reports.
4.  **402 Micro-Payments** enable premium data access (simulated/ready for mainnet).

## 🌟 Overview
Scholar.AI is a next-generation research assistant that leverages autonomous AI agents to perform deep web research, synthesize information, and generate professional reports. It is built with a "No Mocks" philosophy, integrating real-time data and genuine Web3 authentication.

- **Deep Web Search**: Real-time access to the latest information via Tavily API.
- **Web3 Gated Access**: Authenticated via Base Sepolia wallet connection.
- **Student Exam Mode**: Dedicated "Cram Mode" for generating study guides and flashcards.
- **Anti-Gravity UI**: Interactive, physics-based interface (Matter.js) for a premium, fun experience.
- **Premium UX**: High-fidelity dark mode interface with seamless animations.

## 🚀 Tech Stack
- **Framework**: Next.js 14, TypeScript
- **AI Engine**: ADK-TS, Gemini 2.5 Flash
- **Tools**: Tavily Search
- **Web3**: Wagmi, Viem, Reown AppKit
- **Styling**: Tailwind CSS, Framer Motion

## 🛠 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask Wallet (Base Sepolia)

### Installation
1. Clone the repo:
\`\`\`bash
git clone <repo>
cd scholar-ai
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up Environment:
Ensure `.env` contains valid keys for `TAVILY_API_KEY` and `GOOGLE_API_KEY`.

4. Run Development Server:
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000).

## 🏆 Hackathon Tracks
- **Agent Applications**: Fully functional autonomous research agent.
- **Web3 Ecosystem**: Wallet-aware application ready for ATP tokenization.

## 📄 License
MIT

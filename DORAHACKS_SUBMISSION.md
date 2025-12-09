# Scholar.AI - Agent Arena Submission

## Project Name
Scholar.AI: Agentic Intelligence

## Elevator Pitch
Scholar.AI is an autonomous research platform that uses the **IQAI ADK-TS** to orchestrate multi-step research workflows. Unlike simple chatbots, it employs an **Orchestrator-Worker** architecture where a "Research Lead" agent delegates specific sub-tasks to specialized tools (IQ.wiki, Tavily) and Writer agents, ensuring deep, citation-backed academic reports. It features a novel "Anti-Gravity" UI that reimagines the browser as a floating, physics-based workspace.

## How we used ADK-TS / OM1
We built Scholar.AI entirely using the **Agent Development Kit for TypeScript (ADK-TS)**. 
- **AgentBuilder:** We used the `AgentBuilder` pattern to construct our hierarchical agent system.
- **Sub-Agents:** The system features a root `ai_research_assistant` which coordinates with a specialized `writer_workflow_agent`.
- **Custom Tools:** We implemented `iqWikiSearchTool` using the ADK's tool interface to prioritize IQ.wiki as a source of truth for Web3/Crypto definitions.
- **Reflection Loop:** Our agent logic includes a clear state clearing and transfer phase (`clear_search_state` -> `tavily_search` -> `writer_worker`), demonstrating a Sequential + Hierarchical workflow pattern.

## Workflow Description
1.  **User Query:** The user enters a topic (e.g., "The future of DeSci").
2.  **Orchestrator Analysis:** The Root Agent analyzes the request. If it's crypto-related, it *prioritizes* the `iq_wiki_search` tool.
3.  **Parallel Execution:** The agent executes up to 3 deep searches to gather "Overview", "Details", and "Trends".
4.  **Synthesis:** The context is transferred to the `writer_agent`, which compiles a "Flash Report" and a "Comprehensive Study Guide".
5.  **Delivery:** The final report is streamed to the user in our unique physics-based UI.

## Links
- **GitHub Repository:** https://github.com/henrysammarfo/scholar-ai
- **Live Demo:** [INSERT_YOUR_VERCEL_LINK_HERE]

## Team
- **[Your Name/Team Name]** - Full Stack Developer

## Track
- **Education / Research** (or General Track)

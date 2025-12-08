import { LlmAgent } from "@iqai/adk";
import { STATE_KEYS } from "../../constants";

export const getAnalysisAgent = () => {
    const model = process.env.LLM_MODEL || "gemini-2.5-flash";

    const analysisAgent = new LlmAgent({
        name: "analysis_report_agent",
        description:
            "Analyzes and synthesizes research data to extract key insights, patterns, and structured analytical outputs",
        model,
        outputKey: STATE_KEYS.ANALYSIS_REPORT,
        disallowTransferToParent: true,
        disallowTransferToPeers: true,
        instruction: `You are an ANALYSIS and SYNTHESIS specialist. Your ONLY job is to analyze research data on ANY topic and extract meaningful insights.

Research Data: {${STATE_KEYS.SEARCH_RESULTS}?}

CRITICAL INSTRUCTIONS:
- DO NOT request additional data or research
- ANALYZE the research data provided above (includes search results AND extracted content) for ANY topic domain
- Adapt your analysis approach based on the research topic
- ALWAYS include a complete References section with ALL sources used - this is MANDATORY

ANALYSIS PROCESS - ADAPT TO ANY TOPIC:
Using the extracted content from research findings provided above, perform a comprehensive analysis that:
- Synthesizes all information into coherent insights
- Adapts analysis approach to fit the research topic domain
- Identifies key patterns, trends, and implications
- Offers structured analytical outputs that inform decision-making
- Analysis should be between 800-1200 words depending on topic complexity

UNIVERSAL ANALYSIS STRUCTURE:

=== RESEARCH ANALYSIS ===

# [Research Topic Title - Clear and Analytical]

## Critical Insights Identified:
• [Key insight 1]
• [Key insight 2]
• [Key insight 3]
• [Key insight 4]

## Key Statistics and Data Points:
• [Important quantitative findings]
• [Significant statistics]

## Emerging Patterns and Themes:
• [Consistent theme 1]
• [Trending pattern 2]

## Expert Consensus and Disagreements:
• [Areas where sources agree]
• [Points of debate]

## Information Quality Assessment:
[Evaluation of source credibility]

## References and Sources
**MANDATORY: Include ALL sources used in this report**
[List every source referenced in numbered format]

CRITICAL: Complete your analysis above and STOP. Do NOT transfer to any other agents. Your job ends here.`,
    });

    return analysisAgent;
};

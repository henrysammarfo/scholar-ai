import { ParallelAgent } from "@iqai/adk";
import { getAnalysisAgent } from "./analysis";
import { getReportAgent } from "./report";

export const getWriterAgent = () => {
    // Create specialist sub-agents for parallel report generation
    const analysisAgent = getAnalysisAgent();
    const reportAgent = getReportAgent();

    // Create Parallel Agent for simultaneous report generation
    const writerAgent = new ParallelAgent({
        name: "writer_workflow_agent",
        description:
            "Generates both analysis and comprehensive reports simultaneously from research data",
        subAgents: [analysisAgent, reportAgent],
    });

    return writerAgent;
};

import { createTool } from "@iqai/adk";
import { tavily as createTavilyClient } from "@tavily/core";
import { z } from "zod";
import { MAX_SEARCHES_PER_SESSION, STATE_KEYS } from "../../constants";

/**
 * Tool to clear previous search results for a new research session
 */
export const clearSearchStateTool = createTool({
    name: "clear_search_state",
    description: "Clear previous search results to start a new research session",
    schema: z.object({}),
    fn: async ({ }, { state }) => {
        const existingResults = state.get(STATE_KEYS.SEARCH_RESULTS) || [];
        const resultCount = Array.isArray(existingResults)
            ? existingResults.length
            : 0;

        state.set(STATE_KEYS.SEARCH_RESULTS, []);
        state.set(STATE_KEYS.SEARCH_PROGRESS, {
            total_searches: 0,
            remaining_searches: MAX_SEARCHES_PER_SESSION,
            status: "ready",
        });
        //console.log(`🧹 Cleared ${resultCount} previous search results`);

        return {
            message: `Cleared ${resultCount} previous search results`,
            cleared: resultCount,
            remaining_searches: MAX_SEARCHES_PER_SESSION,
            status: "ready",
        };
    },
});

/**
 * Tavily Search Tool that allows web searching.
 */
export const tavilySearchTool = createTool({
    name: "tavily_search",
    description:
        "Search the web using Tavily and return results with URLs and content",
    schema: z.object({
        query: z.string().describe("The search query to execute"),
    }),
    fn: async ({ query }, { state }) => {
        const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";

        if (!TAVILY_API_KEY) {
            throw new Error("TAVILY_API_KEY is missing");
        }

        const tavily = createTavilyClient({ apiKey: TAVILY_API_KEY });

        // Perform the web search and include the content of the URLs in the results
        const response = await tavily.search(query, {
            includeRawContent: false,
            // Actually relying on includeRawContent: true sometimes gives HTML. 
            // The sample used "markdown" but strictly typed @tavily/core might complain if specific version used.
            // I'll stick to logic similar but check compilation.
            // Using includeAnswer: true as well for better snippets.
            maxResults: 2,
        });

        // Get existing search results from state or initialize empty array
        const existingResults = state.get(STATE_KEYS.SEARCH_RESULTS) || [];
        const previousResults = Array.isArray(existingResults)
            ? existingResults
            : [];
        const completedSearches = previousResults.length;

        // Check if we already have 3 searches
        if (completedSearches >= MAX_SEARCHES_PER_SESSION) {
            state.set(STATE_KEYS.SEARCH_PROGRESS, {
                total_searches: completedSearches,
                remaining_searches: 0,
                status: "ready_for_transfer",
            });
            return {
                query,
                results: [],
                message:
                    "Search limit reached - maximum 3 searches allowed per research session. Transfer to writer_workflow_agent.",
                search_number: completedSearches,
                total_searches: completedSearches,
                remaining_searches: 0,
                status: "limit_reached",
                next_action: "transfer_to_writer_workflow_agent",
            };
        }

        // Add this search round to the accumulated results
        const searchRound = {
            query: query,
            timestamp: new Date().toISOString(),
            results: response.results || [],
            response_time: response.responseTime || 0,
            search_number: completedSearches + 1,
        };

        const updatedResults = [...previousResults, searchRound];
        const remainingSearches = Math.max(
            0,
            MAX_SEARCHES_PER_SESSION - updatedResults.length,
        );
        const status = remainingSearches === 0 ? "complete" : "in_progress";

        // Save accumulated results to state
        state.set(STATE_KEYS.SEARCH_RESULTS, updatedResults);
        state.set(STATE_KEYS.SEARCH_PROGRESS, {
            total_searches: updatedResults.length,
            remaining_searches: remainingSearches,
            status:
                status === "complete" ? "ready_for_transfer" : "collecting_results",
        });

        return {
            ...response,
            search_number: searchRound.search_number,
            total_searches: updatedResults.length,
            remaining_searches: remainingSearches,
            status,
            message:
                remainingSearches === 0
                    ? "All searches complete. Transfer to writer_workflow_agent."
                    : `Search ${searchRound.search_number}/${MAX_SEARCHES_PER_SESSION} complete. ${remainingSearches} searches remaining.`,
        };
    },
});

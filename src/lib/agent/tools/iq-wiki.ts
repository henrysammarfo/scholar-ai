import { createTool } from "@iqai/adk";
import { z } from "zod";

/**
 * Tool to search IQ.wiki for blockchain and crypto knowledge
 */
export const iqWikiSearchTool = createTool({
    name: "iq_wiki_search",
    description: "Search IQ.wiki (the world's largest blockchain encyclopedia) for definitions, facts, and detailed information about crypto topics.",
    schema: z.object({
        query: z.string().describe("The search term to find on IQ.wiki"),
    }),
    fn: async ({ query }) => {
        try {
            const response = await fetch("https://api.iq.wiki/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
                        query Search($query: String!) {
                            wikis(id: $query) {
                                id
                                title
                                summary
                                content
                                images {
                                    id
                                }
                            }
                        }
                    `,
                    variables: { query },
                }),
            });

            const data = await response.json();
            const wikis = data.data?.wikis || [];

            if (wikis.length === 0) {
                // Fallback to searching by title if ID lookup fails (simplified for hackathon)
                // For now, return a message if direct lookup fails
                return {
                    results: [],
                    message: "No direct wiki found on IQ.wiki for this term."
                };
            }

            return {
                results: wikis.map((w: any) => ({
                    title: w.title,
                    summary: w.summary,
                    url: `https://iq.wiki/wiki/${w.id}`
                })),
                message: `Found information on IQ.wiki for ${query}`
            };

        } catch (error) {
            console.error("IQ.wiki Search Error:", error);
            return {
                results: [],
                message: "Failed to connect to IQ.wiki API."
            };
        }
    },
});

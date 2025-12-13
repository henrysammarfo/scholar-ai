import { NextRequest, NextResponse } from "next/server";
import { getRootAgent } from "@/lib/agent";
import { scheduleRequest } from "@/lib/request-queue";

export const maxDuration = 300; // Allow long timeouts for research

export async function POST(req: NextRequest) {
    try {
        const { message, mode, walletAddress } = await req.json();

        // Validate input
        if (!message || message.trim().length === 0) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Queue the research request to prevent API quota exhaustion
        const result = await scheduleRequest(
            async () => {
                // Initialize agent
                const { runner } = await getRootAgent();

                // 2. Direct Execution with Context
                // We bypass the conversational confirmation to ensure reliability
                let prompt = `RESEARCH_NOW: ${message}`;

                if (mode === "exam") {
                    prompt += "\nCONTEXT: Treat this as an 'Exam Cram' session. I need a study guide, flashcard concepts, and key definitions suitable for a university final exam. Focus on memorizable facts and core concepts.";
                }

                console.log("Agent Prompt:", prompt);
                const finalReport = await runner.ask(prompt);
                console.log("Agent Final Report Generated");

                return {
                    response: finalReport,
                    debug: { prompt }
                };
            },
            {
                id: `research-${Date.now()}`,
                priority: mode === "exam" ? 6 : 5 // Exam mode gets slightly higher priority
            }
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Agent Error:", error);

        // Handle specific error types
        if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
            return NextResponse.json(
                {
                    error: "API quota exceeded. Please try again in a few moments.",
                    retryAfter: 60
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: error.message || "An error occurred during research" },
            { status: 500 }
        );
    }
}

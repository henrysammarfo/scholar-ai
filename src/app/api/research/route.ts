import { NextRequest, NextResponse } from "next/server";
import { getRootAgent } from "@/lib/agent";

export const maxDuration = 300; // Allow long timeouts for research

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        // Initialize agent
        const { runner } = await getRootAgent();

        // Auto-Pilot Mode: Drive the agent through the standard handshake
        // 1. Initial greeting
        const greeting = await runner.ask("Hi");
        console.log("Agent Greeting:", greeting);

        // 2. Propose Topic
        const topicResponse = await runner.ask(`I want to research: ${message}`);
        console.log("Agent Topic Response:", topicResponse);

        // 3. Confirm & Execute
        // The agent is programmed to start searching immediately after confirmation
        const finalReport = await runner.ask("Yes, please proceed!");
        console.log("Agent Final Report Generated");

        return NextResponse.json({
            response: finalReport,
            debug: { greeting, topicResponse }
        });
    } catch (error: any) {
        console.error("Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

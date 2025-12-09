import { NextRequest, NextResponse } from "next/server";
import { getRootAgent } from "@/lib/agent";

export const maxDuration = 300; // Allow long timeouts for research

export async function POST(req: NextRequest) {
    try {
        const { message, mode } = await req.json();

        // Initialize agent
        const { runner } = await getRootAgent();

        // 1. Initial greeting (Silent or handled by agent)
        const greeting = await runner.ask("Hi");

        // 2. Propose Topic with Mode Context
        let prompt = `I want to research: ${message}`;
        if (mode === "exam") {
            prompt += ". Please treat this as an 'Exam Cram' session. I need a study guide, flashcard concepts, and key definitions suitable for a university final exam. Focus on memorizable facts and core concepts.";
        }

        const topicResponse = await runner.ask(prompt);
        console.log("Agent Context Set:", prompt);

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

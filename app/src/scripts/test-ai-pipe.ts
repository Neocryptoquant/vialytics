import { WalletIntelligence } from "../lib/ai-pipe.ts";
import { readFileSync } from "fs";
import { join } from "path";

async function main() {
    console.log("🚀 Starting AI Pipe Verification (Gemini Mode)...");

    // User provided key manually in chat
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDfau2ZeHs_h-fvrDCpUnWC0FZc6heH2CQ";

    // configuration for Gemini
    const config = {
        apiKey: apiKey,
        provider: "google" as const,
        model: "gemini-2.5-flash" // Available in user's tier
    };

    console.log(`📡 Connecting to AI Provider: Google Gemini`);
    console.log(`🧠 Model: ${config.model}`);

    const ai = new WalletIntelligence(config);

    // 1. Test General Chat
    console.log("\n💬 Testing General Chat...");
    try {
        const chatResponse = await ai.chat([
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Explain how AI works in a few words" }
        ]);
        console.log("🤖 AI Response:", chatResponse);
    } catch (error) {
        console.error("❌ Chat Test Failed:", error);
    }

    // 2. Test Analytics Insights
    console.log("\n📊 Testing Wallet Insights...");
    try {
        const analyticsPath = join(process.cwd(), "..", "analytics_output.json");
        console.log(`📂 Reading analytics from: ${analyticsPath}`);

        const analyticsData = JSON.parse(readFileSync(analyticsPath, "utf-8"));

        console.log("⏳ Generating VERBOSE insights...");
        const insights = await ai.generateInsights(analyticsData);

        const output = JSON.stringify(insights, null, 2);
        console.log("\n✨ Insights Generated (Saving to insights_result.json)");
        const { writeFileSync } = require('fs');
        writeFileSync(join(process.cwd(), "insights_result.json"), output);
        console.log(output);

    } catch (error) {
        console.error("❌ Insights Test Failed:", error);
    }
}

main().catch(console.error);

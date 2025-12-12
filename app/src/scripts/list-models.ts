
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCWUny6z6gzPU4x8wWsglTplwaq5F1COzY";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function main() {
    console.log("Querying Gemini Models...");
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`Error ${res.status}:`, await res.text());
            return;
        }
        const data = await res.json();
        console.log("Available Models:");
        data.models?.forEach((m: any) => {
            if (m.supportedGenerationMethods?.includes("generateContent")) {
                console.log(`- ${m.name}`);
            }
        });
    } catch (e) {
        console.error(e);
    }
}
main();

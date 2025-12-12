// Test if Groq API key is loaded
console.log("🔍 Testing Groq API Key...");

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
    console.error("❌ VITE_GROQ_API_KEY not found!");
    console.log("Current env vars:", import.meta.env);
} else {
    console.log("✅ API key loaded:", apiKey.substring(0, 10) + "...");

    // Test Groq API
    fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "user", content: "Say hello" }
            ],
            max_tokens: 50
        })
    })
        .then(r => r.json())
        .then(data => {
            console.log("✅ Groq API Response:", data);
        })
        .catch(err => {
            console.error("❌ Groq API Error:", err);
        });
}

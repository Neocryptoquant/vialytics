export interface AIConfig {
  apiKey?: string;
  baseUrl?: string;
  provider?: 'openai' | 'groq' | 'google' | 'deepseek' | 'gemini';
  model?: string;
  analytics?: any; // Wallet analytics data
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface WalletInsights {
  personality: string;
  key_insight: string;
  spending_trend: string;
  security_note: string;
}

export class WalletIntelligence {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    // Use Groq API (OpenAI-compatible, free tier)
    const apiKey = this.config.apiKey;
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

    if (!apiKey) {
      return "Please configure your Groq API key. Get one free at https://console.groq.com";
    }

    // Build system prompt with analytics context
    let systemPrompt = `You are Via, a friendly AI wallet assistant for Vialytics. 

IMPORTANT BEHAVIOR RULES:
1. Respond naturally to greetings and casual conversation first
2. Only provide detailed transaction/wallet data when the user explicitly asks for it
3. Use the wallet analytics as background context, not as automatic information to dump
4. Be concise, friendly, and helpful
5. Format your responses clearly with proper markdown (use **bold**, bullet points, etc.)

Examples:
- User: "Hi" → Respond: "Hey there! I'm Via, your wallet assistant. How can I help you today?"
- User: "What's my balance?" → Then provide the balance from context
- User: "Show me my transactions" → Then provide transaction details`;

    if (this.config.analytics) {
      const a = this.config.analytics;
      systemPrompt += `\n\nWallet Analytics Context (use this ONLY when user asks for specific data):\n`;
      systemPrompt += `- Total Balance: $${a.portfolio_overview?.total_balance_usd || 0}\n`;
      systemPrompt += `- Money In: $${a.earnings_spending?.total_received_usd || 0}\n`;
      systemPrompt += `- Money Out: $${a.earnings_spending?.total_sent_usd || 0}\n`;
      systemPrompt += `- Net Flow: $${a.earnings_spending?.net_flow || 0}\n`;
      systemPrompt += `- Active Days: ${a.activity_insights?.active_days_count || 0}\n`;
      systemPrompt += `- Total Transactions: ${a.activity_insights?.total_transactions || 0}\n`;

      if (a.portfolio_overview?.top_tokens?.length > 0) {
        systemPrompt += `- Top Tokens: ${a.portfolio_overview.top_tokens.slice(0, 3).map((t: any) => `${t.symbol} ($${t.value_usd.toFixed(2)})`).join(', ')}\n`;
      }
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(m => ({
              role: m.role === 'system' ? 'system' : m.role,
              content: m.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
    } catch (error) {
      console.error("AI chat error:", error);
      return "Sorry, I'm having trouble connecting to Groq. Please check your API key and internet connection.";
    }
  }

  /* GEMINI VERSION (COMMENTED OUT)
  async chat(messages: ChatMessage[]): Promise<string> {
    const apiKey = this.config.apiKey;
    const model = this.config.model || 'gemini-1.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    if (!apiKey) {
      return "Please configure your Gemini API key.";
    }

    let systemPrompt = "You are Via...";
    if (this.config.analytics) {
      // Add analytics context
    }
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })).filter(m => m.role !== 'system'),
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry...";
    } catch (error) {
      return "Gemini error";
    }
  }
  */

  async generateInsights(analyticsData: any): Promise<WalletInsights> {
    if (!this.config.apiKey) {
      const balance = analyticsData.portfolio_overview?.total_balance_usd || 0;
      const failedTx = analyticsData.security?.failed_transactions_count || 0;

      return {
        personality: balance > 1000 ? "Whale Watcher" : "Detail Oriented Saver",
        key_insight: `You have been active for ${analyticsData.activity_insights?.active_days_count || 0} days recently.`,
        spending_trend: analyticsData.earnings_spending?.net_flow > 0 ? "You are saving more than you spend." : "High outflow detected recently.",
        security_note: failedTx > 0 ? `Detected ${failedTx} failed transactions. Check your gas settings.` : "No security issues detected."
      };
    }

    return {
      personality: "Crypto Native",
      key_insight: "Analysis complete.",
      spending_trend: "Stable",
      security_note: "All good."
    };
  }
}


export interface AIConfig {
  apiKey?: string;
  baseUrl?: string;
  provider?: 'openai' | 'groq' | 'google' | 'deepseek';
  model?: string;
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
    if (!this.config.apiKey) {
      console.warn("WalletIntelligence: No API key provided.");
      return "I can help you analyze your wallet data. Please configure your API key to get real insights.";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model || 'gemini-1.5-flash'}:generateContent?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })).filter(m => m.role !== 'system'),
          systemInstruction: {
            parts: [{ text: "You are Via, a friendly AI wallet assistant for Vialytics. Help users understand their Solana wallet analytics in simple, beginner-friendly language. Be concise and helpful." }]
          }
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
    } catch (error) {
      console.error("AI chat error:", error);
      return "Sorry, I'm having trouble connecting right now.";
    }
  }

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

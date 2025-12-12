# AI Pipe Integration Guide

This guide explains how to use the `WalletIntelligence` class to add AI capabilities to your Solana project. This module is designed to be "vanilla" and modular, working with any React/Next.js setup or even Node.js scripts.

## 1. Setup

### Dependencies
No extra heavy SDKs are required. Just standard TypeScript.

### Environment Variables
You need an API key for your LLM provider. This template supports OpenAI, Groq, DeepSeek, etc.

Create a `.env` file (if you haven't already):
```bash
# Example for Groq
VITE_GROQ_API_KEY=gsk_...
# Example for Google Gemini
VITE_GEMINI_API_KEY=AIza...
# Example for OpenAI
VITE_OPENAI_API_KEY=sk-...
```

## 2. Usage

### Basic Initialization
Import the class from `src/lib/ai-pipe.ts`.

```typescript
import { WalletIntelligence } from '@/lib/ai-pipe';

// Initialize with config
// Initialize with config for Gemini
const ai = new WalletIntelligence({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY, 
  provider: 'google',                      // REQUIRED for Gemini
  model: "gemini-2.5-flash"                // Optional: Defaults to gemini-1.5-flash
});

// OR for OpenAI/Groq
/*
const ai = new WalletIntelligence({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  provider: 'openai',
  model: "gpt-4o"
});
*/
```

### Feature 1: General Chat
Use this for a standard chatbot interface.

```typescript
const response = await ai.chat([
  { role: "system", content: "You are a crypto expert." },
  { role: "user", content: "Explain Solana Proof of History." }
]);
console.log(response); // "Proof of History is..."
```

### Feature 2: Wallet Analytics Insights
Pass your raw JSON data to get structured insights.

```typescript
import analyticsData from './analytics_output.json';

const insights = await ai.generateInsights(analyticsData);

console.log(insights.personality); // "Hodler"
console.log(insights.key_insight); // "User frequently trades MEME tokens..."
```

## 3. Integration with React (Example)

You can wrap this in a simple hook for your components.

```typescript
// hooks/useAI.ts
import { useState } from 'react';
import { WalletIntelligence } from '@/lib/ai-pipe';

export function useAI() {
  const [loading, setLoading] = useState(false);
  
  const generate = async (data: any) => {
    setLoading(true);
    const ai = new WalletIntelligence({ 
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      baseUrl: "https://api.groq.com/openai/v1",
      model: "llama-3.3-70b-versatile"
    });
    
    try {
      return await ai.generateInsights(data);
    } finaly {
      setLoading(false);
    }
  };

  return { generate, loading };
}
```

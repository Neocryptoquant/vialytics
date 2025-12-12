# Vialytics

Your personal Solana wallet analytics companion powered by AI.

## What is this?

Vialytics helps you understand your Solana wallet activity in plain English. Instead of staring at transaction hashes and token addresses, just ask Via - our AI assistant - about your wallet and get beginner-friendly insights.

## Features

- **Wallet Analytics**: Track your balance, transactions, and token holdings
- **AI Chat**: Ask Via anything about your wallet in natural language
- **Activity Insights**: See your spending patterns and transaction history
- **Portfolio Overview**: Understand your token distribution at a glance

## Tech Stack

**Frontend**: React, TypeScript, Bun, Tailwind CSS  
**Backend**: FastAPI, Python  
**Indexer**: Rust (vialytics-core)  
**AI**: Groq API (llama-3.3-70b)  
**Data**: Supabase (optional caching)

## Quick Start

### Prerequisites

- Bun runtime installed
- Python 3.8+
- Groq API key (free at console.groq.com)

### Running Locally

**1. Start the backend**

```bash
cd vialytics-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=src python -m vialytics_api.api_server
```

**2. Start the frontend**

```bash
cd app
cp .env.example .env
# Add your VITE_GROQ_API_KEY to .env
bun install
bun run dev
```

Visit `http://localhost:3000`

### Using the Indexer

The core indexer is built in Rust and processes Solana transaction history.

```bash
cd vialytics-core
cargo build --release
./target/release/vialytics-core <WALLET_ADDRESS>
```

This creates `wallet.db` which the API uses for analytics.

## Project Structure

```
vialytics/
├── app/                    # Frontend (React + Bun)
│   ├── src/
│   │   ├── pages/         # Landing, Loading, Dashboard
│   │   ├── components/    # Via chat, news, stats
│   │   └── lib/          # AI integration
├── vialytics-api/         # Backend API (FastAPI)
│   └── src/
│       └── vialytics_api/
│           └── services/  # Analytics, Supabase
└── vialytics-core/        # Transaction indexer (Rust)
```

## Configuration

**Frontend** (`app/.env`):
```
VITE_GROQ_API_KEY=your_groq_api_key
```

**Backend** (optional, `vialytics-api/.env`):
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## How It Works

1. User enters their Solana wallet address
2. Indexer fetches and processes transaction history
3. Analytics engine generates insights (balance, tokens, activity)
4. Via AI uses this data to answer questions about the wallet
5. Results are cached in Supabase for faster subsequent loads

## Development

The project uses:
- **Bun** for frontend tooling and dev server
- **FastAPI** for the backend API
- **Rust** for high-performance transaction indexing
- **Groq** for AI chat (OpenAI-compatible API)

Environment variables are injected via `/api/config` endpoint to work with Bun's runtime.

## Known Issues

- Mascot image may not load due to public folder caching
- Indexer needs vialytics-core binary built or cargo available
- Analytics are currently simulated - real indexer integration pending

## License

MIT

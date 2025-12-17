# Vialytics

Your personal Solana wallet analytics companion powered by AI.

**Live at [vialytics.xyz](https://vialytics.xyz)**
Aims to be the business intelligence tool for Solana Maxis.

## What is this?

Vialytics helps you understand your Solana wallet activity in plain English. Instead of staring at transaction hashes and token addresses, just ask Via - our AI assistant - about your wallet and get friendly insights.

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

## Helius / Orb enrichment (backend)

For the MVP the backend (`vialytics-api`) enriches wallet analytics using Helius / Orb to provide
immediate, user-friendly data such as token balances, NFT ownership and recent activity. This
enrichment is ephemeral and cached in-process for a short TTL (default 300 seconds). It is merged
into the analytics JSON under the `external_sources.helius_orb` key.

Configuration:
- Add `HELIUS_API_KEY` to `vialytics-api/.env`.
- Optionally set `HELIUS_ORB_URL` to override the API base URL.

Notes:
- The enrichment is performed by the backend and is intentionally not persisted to the main
	analytics database to avoid adding long-term storage for external data during the MVP.
- Caching is in-process (no Redis) to reduce infra complexity for the MVP.


## How It Works

1. User enters their Solana wallet address
2. Indexer fetches and processes transaction history
3. Analytics engine generates insights (balance, tokens, activity)
4. Via AI uses this data to answer questions about the wallet
5. Results are cached in Supabase for faster subsequent loads

## Deployment

We plan to deploy the frontend and backend under the `vialytics.xyz` domain. The domain is reserved
and will be used for production deployments; environment configuration and DNS/hosting details will
be added to deployment docs when ready.

## Development

The project uses:
- **Bun** for frontend tooling and dev server
- **FastAPI** for the backend API
- **Rust** for high-performance transaction indexing
- **Groq** for AI chat (OpenAI-compatible API)

Environment variables are injected via `/api/config` endpoint to work with Bun's runtime.

## Known Issues
- Indexer needs vialytics-core binary built or cargo available

## License

MIT

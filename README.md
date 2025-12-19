<p align="center">
  <img src="app/public/vialytics-logo.jpg" alt="Vialytics Logo" width="200"/>
</p>

<h1 align="center">Vialytics</h1>

<p align="center">
  <strong>Personal Analytics & Business Intelligence for Everyone</strong>
</p>

<p align="center">
  <a href="https://vialytics.xyz">🌐 Live Demo</a> •
  <a href="#-watch-the-demo">📺 Pitch Video</a> •
  <a href="https://x.com/eaabimbola">𝕏 Twitter</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solana-black?logo=solana&logoColor=14F195" alt="Solana"/>
  <img src="https://img.shields.io/badge/Rust-black?logo=rust&logoColor=orange" alt="Rust"/>
  <img src="https://img.shields.io/badge/React-black?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/FastAPI-black?logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/AI%20Powered-black?logo=openai" alt="AI"/>
</p>

---

## 📺 Watch the Demo

> **[🎬 Click here to watch the pitch video](YOUR_VIDEO_LINK_HERE)**
>
> *Video coming soon — will be added before final submission*

---

## 🎯 The Problem

Solana founders and individuals are drowning in data:

- **Dune Analytics** requires SQL knowledge and custom dashboard setup
- **Alchemy** and similar tools provide raw data overload
- **Block explorers** show transaction hashes, not insights
- **No simple way** to understand "where is my money going?"

**Result:** Hours wasted trying to make sense of on-chain activity instead of building or investing.

---

## 💡 The Solution

**Vialytics** turns your Solana wallet data into plain-English insights powered by AI.

Just paste your wallet address and ask Via — our AI assistant — anything:

> *"Where did I spend the most this month?"*  
> *"What tokens am I most active in?"*  
> *"Summarize my wallet activity"*

No dashboards to configure. No SQL to write. Just answers.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🤖 Via AI Chat** | Natural language Q&A about your wallet activity |
| **📊 Activity Dashboard** | Total balance, money in/out, net flow at a glance |
| **📈 Activity Charts** | Visual timeline of your on-chain activity |
| **🏷️ Smart Labels** | Friendly names for known protocols (Jupiter, Raydium, etc.) |
| **⚡ Rust Indexer** | High-performance transaction processing |
| **🔌 Helius Integration** | Real-time data enrichment from Helius/Orb |

---

## 📸 Screenshots

<!-- Replace these placeholders with actual screenshots -->

<p align="center">
  <img src="YOUR_SCREENSHOT_1" alt="Landing Page" width="400"/>
  <img src="YOUR_SCREENSHOT_2" alt="Dashboard" width="400"/>
</p>

<p align="center">
  <img src="YOUR_SCREENSHOT_3" alt="Via AI Chat" width="400"/>
  <img src="YOUR_SCREENSHOT_4" alt="Activity Chart" width="400"/>
</p>

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        VIALYTICS                            │
├─────────────────────────────────────────────────────────────┤
│  Frontend        │  React + TypeScript + Bun + Tailwind     │
│  Backend         │  FastAPI (Python)                        │
│  Indexer         │  Rust (yellowstone-vixen)                │
│  AI              │  Groq API (llama-3.3-70b)                │
│  Data Enrichment │  Helius / Orb API                        │
│  Database        │  SQLite + Supabase (caching)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Future Vision

### Phase 1: SDK Release
Integrate Vialytics into your own app with a simple SDK:

```typescript
import { Vialytics } from '@vialytics/sdk';

const analytics = new Vialytics({ apiKey: 'your-key' });
const insights = await analytics.getWalletInsights('wallet-address');
```

### Phase 2: Team Analytics Platform
A full platform for founders and teams to:
- Monitor their **program accounts** and **token treasuries**
- Set up **alerts** for unusual activity
- Generate **reports** for stakeholders
- **No custom indexers needed** — just plug in your addresses

### Phase 3: Multi-Chain Expansion
Extend beyond Solana to support EVM chains and more.

---

## 🏃 Quick Start

<details>
<summary><strong>Click to expand setup instructions</strong></summary>

### Prerequisites
- Bun runtime
- Python 3.8+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend

```bash
cd vialytics-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=src python -m vialytics_api.api_server
```

### Frontend

```bash
cd app
cp .env.example .env
# Add your VITE_GROQ_API_KEY to .env
bun install
bun run dev
```

Visit `http://localhost:3000`

### Configuration

**Frontend** (`app/.env`):
```
VITE_GROQ_API_KEY=your_groq_api_key
```

**Backend** (`vialytics-api/.env`):
```
HELIUS_API_KEY=your_helius_key
SUPABASE_URL=your_supabase_url  # optional
SUPABASE_KEY=your_supabase_key  # optional
```

</details>

---

## 📁 Project Structure

```
vialytics/
├── app/                    # Frontend (React + Bun)
│   ├── src/
│   │   ├── pages/          # Landing, Loading, Dashboard
│   │   ├── components/     # Via chat, stats, news
│   │   └── lib/            # AI integration, labels
├── vialytics-api/          # Backend API (FastAPI)
│   └── src/vialytics_api/
│       └── services/       # Analytics, Helius, Labels
└── vialytics-core/         # Transaction indexer (Rust)
```

---

## 👤 Team

**Emmanuel Adebayo Abimbola**  
Solana Turbin3 Q4 Builder

- GitHub: [@neocryptoquant](https://github.com/neocryptoquant)
- X/Twitter: [@eaabimbola](https://x.com/eaabimbola)

---

## 🏆 Hackathon

Built for the **Solana Student Hackathon**.

This project aims to become the go-to analytics infrastructure for the Solana ecosystem — making wallet intelligence accessible to everyone, from individual traders to protocol teams.

---

## 📄 License

MIT

---

<p align="center">
  Made with ❤️ for the Solana ecosystem
</p>

<p align="center">
  <a href="https://vialytics.xyz">Try Vialytics Now →</a>
</p>

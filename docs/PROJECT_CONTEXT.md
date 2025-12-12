# Vialytics & Solana Wrapped - Project Context

**Last Updated:** December 6, 2025
**Status:** Active Development (Hackathon Phase)

## 1. Project Overview

**Vialytics** is a comprehensive analytics platform for Solana, designed to provide deep insights into wallet activity, token movements, and behavioral patterns.

**Solana Wrapped** is a specific feature/product within the Vialytics ecosystem (currently running as a standalone frontend) that generates a "Spotify Wrapped" style year-in-review for Solana users. It analyzes their on-chain history to produce shareable stats and an "AI Persona".

## 2. Architecture & Monorepo Structure

The project is organized as a monorepo in `~/sol-quant/hackathon/vialytics/`.

### 2.1. Core Components

*   **`vialytics-core` (Rust)**
    *   **Role:** The high-performance indexing engine.
    *   **Tech:** Rust, Yellowstone gRPC (Geyser), SQLite, SQLx.
    *   **Function:** Connects to a Solana RPC (Helius), fetches historical transactions for a specific wallet, parses them, and stores raw transaction data and token movements into a local SQLite database (`wallet_<address>.db`).
    *   **Key Logic:** `src/history.rs` (fetching), `src/db.rs` (storage), `src/parser.rs` (parsing).

*   **`solana-wrapped` (Next.js)**
    *   **Role:** The user-facing frontend for the Wrapped experience.
    *   **Tech:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, Solana Wallet Adapter.
    *   **Function:**
        *   Landing page for wallet connection.
        *   Payment handling (0.02 SOL fee).
        *   Real-time status updates via Supabase.
        *   **`WrappedStory.tsx`**: The core UI component that renders the animated stats slideshow.

*   **`wrapped-worker` (Node.js/TypeScript)**
    *   **Role:** The orchestration layer.
    *   **Tech:** Node.js, TypeScript, Supabase Client, `better-sqlite3`.
    *   **Function:**
        *   Polls Supabase for `pending` requests.
        *   **Orchestration:** Spawns the `vialytics-core` binary to index data for the requested wallet.
        *   **Analytics:** Connects to the generated SQLite DB to run complex SQL queries (Volume, Gas, Holding Time).
        *   **AI Persona:** Applies rule-based logic to assign a persona (e.g., "The Degen", "Diamond Hands").
        *   Updates Supabase with the final JSON result.

*   **`vialytics-web` (Next.js)**
    *   **Role:** The main dashboard for the broader Vialytics platform (separate from the Wrapped specific UI).
    *   **Status:** In development, focuses on deep-dive analytics (Sankey diagrams, heatmaps).

### 2.2. Infrastructure

*   **Database (Supabase):**
    *   Used as a coordination layer and persistent store for requests.
    *   **Table:** `wrapped_requests`
        *   `id`: UUID
        *   `wallet_address`: String
        *   `status`: 'pending' | 'processing' | 'completed' | 'failed'
        *   `stats_json`: JSONB (Stores the final report data)
        *   `tx_signature`: String (Payment proof)
*   **Database (Local SQLite):**
    *   Ephemeral databases created by `vialytics-core` for each wallet analysis.
    *   Stored in `wrapped-worker/dbs/`.
    *   Deleted after processing (in production).

## 3. Data Flow (End-to-End)

1.  **User Interaction:** User connects wallet on `solana-wrapped` and clicks "Generate".
2.  **Payment:** User signs a 0.02 SOL transaction (currently bypassed in "Free Mode").
3.  **Request Creation:** Frontend inserts a row into Supabase `wrapped_requests` with status `pending`.
4.  **Worker Pickup:** `wrapped-worker` detects the new row (via Realtime subscription or polling).
5.  **Indexing:**
    *   Worker generates a temporary `Vixen.toml` config.
    *   Worker spawns `vialytics-core` process.
    *   `vialytics-core` fetches history from RPC and populates `wallet_<address>.db`.
6.  **Analysis:**
    *   Worker connects to `wallet_<address>.db`.
    *   Worker runs SQL queries to calculate:
        *   Total Transactions
        *   Total Gas Spent (SOL)
        *   Total Volume (USD estimate)
        *   Top Token (by interaction count)
        *   Max Holding Time (Diamond Hands score)
    *   Worker determines "AI Persona" based on these stats.
7.  **Completion:** Worker updates Supabase row to `completed` with the `stats_json`.
8.  **Display:** Frontend receives the update and renders the `WrappedStory` slideshow.

## 4. Current Status & Configuration

*   **Environment:** Devnet (for testing).
*   **Payment:** **DISABLED** (Free Mode active). Code is commented out in `solana-wrapped/app/page.tsx` and `wrapped-worker/src/index.ts`.
*   **Supabase:**
    *   URL: `https://fgccwudbkkkqwiuuqfnk.supabase.co`
    *   **Critical:** The `wrapped_requests` table MUST exist. (SQL schema provided in logs).
*   **Worker:**
    *   Must be running: `npx ts-node src/index.ts` inside `wrapped-worker`.
    *   Requires `vialytics-core` to be built (`cargo build --release`).

## 5. How to Run

### Prerequisites
*   Node.js & npm
*   Rust & Cargo
*   Supabase Project (with `wrapped_requests` table)

### Step 1: Build Core
```bash
cd vialytics-core
cargo build --release
```

### Step 2: Start Worker
```bash
cd wrapped-worker
npm install
npx ts-node src/index.ts
```

### Step 3: Start Frontend
```bash
cd solana-wrapped
npm install
npm run dev
```

## 6. Known Issues & Todo

*   **Payment Verification:** Currently commented out. Needs to be uncommented and robustly tested for Mainnet.
*   **RPC Rate Limits:** The `vialytics-core` fetcher is aggressive. Needs rate limiting or a paid RPC for heavy production use.
*   **Token Pricing:** Volume calculation assumes 1 SOL = $200 and ignores other token values. Needs integration with a price API (Jupiter/Birdeye) for accurate USD volume.
*   **Error Handling:** If `vialytics-core` fails or hangs, the worker might timeout. Needs better process management.
*   **Security:** RLS policies on Supabase are currently "public read/write" for simplicity. Needs to be locked down (Service Role for worker).

## 7. Key Files Reference

*   **Worker Logic:** `wrapped-worker/src/index.ts` (Main loop), `wrapped-worker/src/analytics.ts` (Stats generation).
*   **Frontend Logic:** `solana-wrapped/app/page.tsx` (Main flow), `solana-wrapped/components/WrappedStory.tsx` (UI).
*   **Core Logic:** `vialytics-core/src/history.rs` (RPC Fetching), `vialytics-core/src/db.rs` (Schema).

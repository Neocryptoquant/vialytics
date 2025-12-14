Vialytics API — Helius/Orb Enrichment
====================================

This service provides wallet analytics and — for the MVP — enriches the analytics response
with additional data from Helius / Orb (address metadata, token balances, NFTs, recent txs).

How it works
- The API calls the local indexer (`vialytics-core`) to compute analytics from indexed data.
- On each analytics request the backend will also call Helius/Orb to fetch extra enrichment data
  for the requested wallet and merge it into the response under `external_sources.helius_orb`.
- Enrichment is cached in-process for a short TTL (default 300 seconds) to reduce API usage.

Configuration
- `HELIUS_API_KEY`: your Helius API key (set in `.env`).
- `HELIUS_ORB_URL`: optional base URL for the Helius/Orb API (defaults to `https://api.helius.xyz`).

Notes
- Caching is currently in-process (no Redis) to keep the MVP simple and avoid extra infra.
- The enrichment is ephemeral and does not persist to the project database.

Quick usage
1. Add your API key to `vialytics-api/.env`:

```dotenv
HELIUS_API_KEY=your-key-here
```

2. Start the API (from repo root):

```bash
cd vialytics-api
source venv/bin/activate
python -m vialytics_api.api_server
```

3. Request analytics for a wallet:

```bash
curl http://localhost:8000/api/analytics/
```

The returned JSON will include an `external_sources.helius_orb` key when enrichment succeeds.

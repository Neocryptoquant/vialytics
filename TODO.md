# Vialytics - Development TODO

Last updated: Dec 14, 2024 06:14 WAT

---

## ✅ DONE

### Backend
- [x] Fixed `helius_client.py` with correct Helius API endpoints
  - Base URL: `https://api-mainnet.helius-rpc.com`
  - DAS RPC method: `getAssetsByOwner` for tokens/NFTs
  - Transactions: `/v0/addresses/{address}/transactions`
- [x] Added `/api/enrichment/{wallet}` endpoint
- [x] Expanded `label_service.py` with 30+ known Solana addresses
- [x] Created `vialytics-api/.env.example`
- [x] Rewrote tests without mocks (Helius tests skip if no API key)
- [x] Added tests README

### Frontend
- [x] Typewriter animation on welcome message
- [x] Typewriter animation on wallet input placeholder
- [x] Header search → Helius Orb link (form submits to orb.helius.dev)
- [x] Updated Helius icon in header
- [x] Created `lib/labels.ts` utility for frontend labels
- [x] Enhanced `StatCard.tsx` with hover effects and trend indicators
- [x] Token display uses friendly names (SOL, USDC, JUP, etc.)
- [x] AI chat improvements (natural conversation, markdown formatting)

---

## 🔴 BROKEN / NEEDS FIX

### Top Income Sources + Top Spending Cards
**Status**: Not showing data on dashboard  
**Location**: `app/src/pages/Dashboard.tsx` lines 290-350  
**Issue**: After Helius client refactor, the `enrichment.normalized.top_counterparties` and `enrichment.normalized.top_spending_categories` may not be populated correctly.

**To fix**:
1. Check backend `helius_client.py` `_normalize_data()` method
2. Verify `top_counterparties` and `top_spending_categories` are being built
3. Check frontend fallback logic in Dashboard when enrichment is empty
4. Test with live HELIUS_API_KEY

---

## 📋 TODO

### Priority 1: Fix Income/Spending Display
- [ ] Debug why `top_counterparties` not appearing
- [ ] Debug why `top_spending_categories` not appearing
- [ ] Verify Helius API returns transaction data
- [ ] Test end-to-end with HELIUS_API_KEY set

### Priority 2: Code Cleanup
- [ ] Remove useless comments from all files
- [ ] Add `0xAbim:` prefix to necessary comments only
- [ ] Organize tests into `tests/services/` and `tests/api/`
- [ ] Update gitignore if needed

### Priority 3: Final Testing
- [ ] Test backend startup
- [ ] Test frontend startup
- [ ] Test full flow: landing → loading → dashboard
- [ ] Test Via AI chat
- [ ] Test Solana news feed

### Priority 4: Push to Main
- [ ] Review all changes
- [ ] Commit with meaningful messages
- [ ] Push to main branch

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `vialytics-api/src/vialytics_api/services/helius_client.py` | Helius API integration |
| `vialytics-api/src/vialytics_api/services/label_service.py` | Address → friendly name mapping |
| `vialytics-api/src/vialytics_api/api_server.py` | FastAPI routes |
| `app/src/pages/Dashboard.tsx` | Main dashboard with stats/charts |
| `app/src/lib/labels.ts` | Frontend label utility |
| `app/src/components/StatCard.tsx` | Stat card component |

---

## 🔧 Environment

**Backend** (`vialytics-api/.env`):
```
HELIUS_API_KEY=your_key
GEMINI_API_KEY=your_key (or GROQ)
```

**Frontend** (`app/.env`):
```
VITE_GROQ_API_KEY=your_key
```

---

## 🚀 Quick Start Commands

```bash
# Backend
cd vialytics-api
source venv/bin/activate
PYTHONPATH=src python -m vialytics_api.api_server

# Frontend
cd app
bun run dev
```

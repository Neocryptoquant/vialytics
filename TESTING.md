# Vialytics - Quick Setup Guide

## What We Built

### Frontend
- ✅ Landing page with neumorphism design
- ✅ Loading page with animations  
- ✅ Dashboard with wallet routing
- ✅ Via mascot and Solana news

### Backend
- ✅ Indexer API endpoints
- ✅ Analytics by wallet
- ✅ Supabase integration (optional)

---

## Testing Instructions

### 1. Install Backend Dependencies
```bash
cd vialytics-api
source venv/bin/activate
pip install supabase  # Optional - for caching
```

### 2. Set Environment Variables
```bash
# In vialytics-api/.env (optional)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 3. Start Backend
```bash
cd vialytics-api
source venv/bin/activate
PYTHONPATH=src python -m vialytics_api.api_server
```

### 4. Start Frontend
```bash
cd app
bun run dev
```

### 5. Test Flow
1. Visit `http://localhost:3000`
2. Enter a Solana wallet address
3. Click "Analyze My Wallet"
4. Watch loading animations
5. See dashboard (simulated for now)

---

## Known Limitations

1. **Indexer is simulated** - Doesn't actually run vialytics-core yet
2. **Via chat** - Uses mock responses, need to debug Gemini API
3. **Supabase** - Optional, works without it

---

## Next Steps

1. Test landing page loads
2. Debug Via chat with Gemini
3. Integrate real indexer subprocess
4. Add Supabase caching

---

## Files Created

**Frontend:**
- `app/src/pages/LandingPage.tsx`
- `app/src/pages/LoadingPage.tsx`  
- `app/src/App.tsx` (updated with routing)

**Backend:**
- `vialytics-api/src/vialytics_api/api_server.py` (updated)
- `vialytics-api/src/vialytics_api/services/supabase_service.py`

**Database:**
- `supabase_schema.sql` (run in Supabase SQL editor)

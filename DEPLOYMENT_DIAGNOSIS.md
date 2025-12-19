# Vialytics Deployment Diagnosis

## Current Status

### ✅ Working
- Railway API deployed: `https://vialytics-production.up.railway.app`
- Health endpoint responds: HTTP 200
- CORS configured correctly for `https://vialytics.xyz`
- Vercel frontend deployed: `https://vialytics.xyz`

### ❌ Not Working
- Frontend shows: "Failed to connect to server"
- API calls from frontend failing

## Diagnostic Steps

### 1. Verify Environment Variable in Build

**Check Vercel build logs:**
- Go to Vercel → Deployments → Latest deployment → Build Logs
- Search for `VITE_API_URL`
- Should see: `VITE_API_URL=https://vialytics-production.up.railway.app`

**If NOT found:** Environment variable not injected during build

### 2. Check Browser Console

**On https://vialytics.xyz, open DevTools Console and run:**
```javascript
// Check what API_BASE is set to
import('/src/lib/api.ts').then(m => console.log('API_BASE:', m.API_BASE))
```

**Expected:** `https://vialytics-production.up.railway.app`
**If localhost:** Environment variable not working

### 3. Check Network Tab

**In DevTools Network tab:**
- Enter wallet address
- Click analyze
- Look for failed request
- Check the URL it's trying to call

**Expected:** `https://vialytics-production.up.railway.app/api/analytics/...`
**If localhost:** Confirms env var issue

### 4. Test API Directly

**From browser console on vialytics.xyz:**
```javascript
fetch('https://vialytics-production.up.railway.app/health')
  .then(r => r.json())
  .then(d => console.log('API Response:', d))
  .catch(e => console.error('API Error:', e))
```

**Expected:** `{status: "healthy", service: "vialytics-api"}`
**If CORS error:** CORS issue
**If network error:** Railway not accessible

## Potential Root Causes

### A. Environment Variable Not Applied
**Symptoms:** Build logs don't show VITE_API_URL
**Fix:** 
1. Ensure env var is set for "Production" environment
2. Redeploy with fresh build (uncheck cache)

### B. Vite Not Reading import.meta.env
**Symptoms:** Browser shows localhost in API calls
**Fix:** Check vite.config.ts or use alternative approach

### C. Build Output Issue
**Symptoms:** Old code deployed
**Fix:** Clear Vercel build cache and redeploy

### D. CORS Despite Configuration
**Symptoms:** Browser console shows CORS error
**Fix:** Add `https://vialytics.xyz` to Railway ALLOWED_ORIGINS

## Alternative Solutions

### Option 1: Hardcode for Now
Temporarily hardcode the API URL in `api.ts`:
```typescript
export const API_BASE = 'https://vialytics-production.up.railway.app';
```

### Option 2: Use Vercel Rewrites
Add to `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://vialytics-production.up.railway.app/api/:path*"
    }
  ]
}
```
Then use relative URLs: `/api/analytics/...`

### Option 3: Runtime Config
Create `/public/config.json`:
```json
{"apiUrl": "https://vialytics-production.up.railway.app"}
```
Fetch at runtime instead of build time.

## Next Steps

1. Check Vercel build logs for VITE_API_URL
2. Check browser console for actual API_BASE value
3. Based on findings, apply appropriate fix

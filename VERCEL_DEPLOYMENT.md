# Vercel Deployment Guide

## Prerequisites
1. Railway backend deployed and healthy
2. Railway URL (e.g., `https://vialytics-api-production.up.railway.app`)

## Deployment Steps

### 1. Import to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "Add New" → "Project"
- Import your GitHub repo: `Neocryptoquant/vialytics`

### 2. Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `app`
- **Build Command**: `bun run build` (or leave default)
- **Output Directory**: `dist` (or leave default)

### 3. Add Environment Variables
Click "Environment Variables" and add:

| Name | Value | Example |
|------|-------|---------|
| `VITE_API_URL` | Your Railway URL | `https://vialytics-api-production.up.railway.app` |
| `VITE_GROQ_API_KEY` | Your Groq API key | `gsk_...` |

### 4. Deploy
- Click "Deploy"
- Wait for build to complete
- Vercel will give you a URL like `https://vialytics.vercel.app`

### 5. Add Custom Domain (Optional)
- Go to Project Settings → Domains
- Add `vialytics.xyz`
- Follow DNS instructions

### 6. Update Railway CORS
After Vercel deploys, update Railway environment variables:
- Add your Vercel URL to allowed origins if needed
- The current CORS config already allows `*.vercel.app`

## Testing
1. Visit your Vercel URL
2. Enter a wallet address
3. Verify it calls Railway backend correctly

## Troubleshooting

**Build fails**: Check that `bun-env.d.ts` has proper types
**API calls fail**: Verify `VITE_API_URL` is set correctly
**CORS errors**: Check Railway CORS configuration includes your Vercel domain

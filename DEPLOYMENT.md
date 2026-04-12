# MK Black Friday Radar - Deployment Guide

## 🚀 Complete Setup with All Services

This guide walks you through deploying the MK Black Friday Radar platform with all integrated services.

---

## 📋 API Keys Required

### Fireworks AI (Kimi K2.5 Turbo)
- Get API key from: https://fireworks.ai/account/api-keys
- **Model**: `accounts/fireworks/routers/kimi-k2p5-turbo`
- **Base URL**: `https://api.fireworks.ai/inference/v1`

### PostHog Analytics
- Sign up at: https://posthog.com
- Create a project and get your API key

### Mapbox
- Get token from: https://account.mapbox.com/access-tokens

### Sentry Error Tracking
- Sign up at: https://sentry.io
- Create a project and get your DSN

### Cloudflare R2 Storage
- Sign up at: https://dash.cloudflare.com
- Enable R2 and create API tokens

---

## 🛠️ Step-by-Step Deployment

### 1. Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Maliot100X/Black-Friday.git
cd Black-Friday

# Create .env file with all your API keys
cp .env.example .env

# Edit .env and add your real API keys
nano .env
```

### 2. Start Backend (Docker)

```bash
# Build and start all services
docker-compose up -d

# Verify services are running
curl http://localhost:8000/health
```

### 3. Start Frontend (Local)

```bash
cd frontend
npm install
npm run dev

# Frontend will be at http://localhost:3000
```

### 4. Start Mobile App

```bash
cd mobile
npm install
npx expo start

# Scan QR code with Expo Go app or press 'a' for Android emulator
```

---

## 🌐 Vercel Deployment (Frontend)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy to Vercel

```bash
cd frontend
vercel --prod
```

### Step 3: Set Environment Variables in Vercel Dashboard

Go to your project settings in Vercel and add these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
FIREWORKS_API_KEY=your_fireworks_key
POSTHOG_API_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn
```

---

## 🔧 Backend Deployment Options

### Option A: Railway/Render (Recommended)

1. Connect your GitHub repo to Railway or Render
2. Set the root directory to `/backend`
3. Add all environment variables from your .env file
4. Deploy

### Option B: AWS/GCP/Azure

```bash
# Build Docker image
docker build -t mkbf-backend ./backend

# Push to container registry
docker tag mkbf-backend your-registry/mkbf-backend
docker push your-registry/mkbf-backend

# Deploy using your cloud provider's container service
```

### Option C: VPS (DigitalOcean, Linode, etc.)

```bash
# On your VPS
git clone https://github.com/Maliot100X/Black-Friday.git
cd Black-Friday
cp .env.example .env
# Edit .env with your API keys

docker-compose -f docker-compose.yml up -d
```

---

## 📱 Mobile App - Google Play Store

### Step 1: Configure EAS (Expo Application Services)

```bash
cd mobile
npm install -g eas-cli
eas login
```

### Step 2: Build APK (Preview)

```bash
eas build -p android --profile preview
```

### Step 3: Build AAB for Play Store

```bash
eas build -p android --profile production
```

### Step 4: Submit to Play Store

1. Download the AAB file from EAS
2. Go to [Google Play Console](https://play.google.com/console)
3. Create a new app
4. Upload the AAB file
5. Fill in store listing details
6. Submit for review

---

## 🔌 Service Integration Guide

### Fireworks AI (Kimi Model)

The backend automatically uses Fireworks AI when `FIREWORKS_API_KEY` is set:

```python
# backend/main.py and agents/crew_config.py
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY")
FIREWORKS_MODEL = "accounts/fireworks/routers/kimi-k2p5-turbo"
FIREWORKS_BASE_URL = "https://api.fireworks.ai/inference/v1"
```

### PostHog Analytics

Add to your frontend:

```typescript
// frontend/app/layout.tsx
import posthog from 'posthog-js'

posthog.init('YOUR_POSTHOG_KEY', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only'
})
```

### Sentry Error Tracking

Already configured in backend/main.py:

```python
import sentry_sdk
sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"))
```

### Mapbox Maps

Update the map component with your token:

```typescript
// frontend/components/MapRadar.tsx
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
```

### Cloudflare R2 (Image Storage)

Configure in backend for deal image uploads:

```python
# utils/storage.py
R2_ENDPOINT = os.getenv("R2_S3_ENDPOINT")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
```

---

## 🌍 Domain Setup

### Custom Domain on Vercel

1. Buy domain from Cloudflare or any registrar
2. In Vercel dashboard: Project → Settings → Domains
3. Add your domain: `mkblackfriday.com`
4. Update DNS records as instructed by Vercel

### Backend API Domain

1. Point `api.mkblackfriday.com` to your backend server
2. Set up SSL with Let's Encrypt
3. Update frontend environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://api.mkblackfriday.com
   ```

---

## ✅ Post-Deployment Checklist

- [ ] Backend API responding at `/health`
- [ ] Frontend loading without errors
- [ ] AI chatbot responding in Macedonian
- [ ] AI chatbot responding in Albanian
- [ ] QR scanner working on mobile
- [ ] Map loading with Mapbox
- [ ] Analytics showing in PostHog
- [ ] Errors appearing in Sentry
- [ ] Push notifications working (mobile)
- [ ] Deal search returning results
- [ ] QR code verification working

---

## 📞 Support

If you need help:
1. Check the logs: `docker-compose logs -f`
2. Review GitHub Issues: https://github.com/Maliot100X/Black-Friday/issues
3. Contact support with your deployment details

---

## 🎉 Done!

Your MK Black Friday Radar platform is now ready to deploy with:
- ✅ Fireworks AI (Kimi K2.5 Turbo) powering all AI features
- ✅ Multilingual chatbot (Macedonian & Albanian)
- ✅ QR code scanner for real store integration
- ✅ PostHog analytics tracking
- ✅ Sentry error monitoring
- ✅ Mapbox maps
- ✅ Cloudflare R2 storage
- ✅ Vercel hosting ready
- ✅ Google Play Store ready

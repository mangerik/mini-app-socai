# Socai Mini App - AI Video Generator

Mini App Socai.id adalah PWA mobile-first untuk promosi yang memungkinkan user mencoba generate video AI dengan 50 token gratis.

## 🚀 Features

- **PWA (Progressive Web App)** dengan offline support
- **Mobile-first design** yang responsif
- **OTP Authentication** via SMS menggunakan Supabase Auth
- **Token Management System** (50 token gratis = 2 video)
- **Image Upload & Caching** sebelum login
- **AI Video Generation** via Edge Function proxy
- **Video Download & Share** functionality
- **Subscription CTA** ketika token habis

## 📱 User Flow

1. **Landing Page** → User melihat offer 50 token gratis
2. **Upload Foto** → Foto disimpan di cache browser
3. **OTP Login** → SMS verification (nomor Indonesia +62)
4. **Generate Video** → Upload ke Supabase Storage → AI processing
5. **Result Page** → Video player, download, share
6. **Token Management** → Redirect ke subscription setelah token habis

## 🛠 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Supabase (Auth, Storage, Database, Edge Functions)
- **PWA:** Service Worker, Manifest, Install Prompt
- **Authentication:** Supabase Auth with SMS OTP
- **Storage:** Supabase Storage bucket
- **Database:** PostgreSQL with RLS

## 📦 Setup & Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd socai-miniapp
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Socai API (for Edge Function)
SOCAI_API_URL=your_socai_api_endpoint
SOCAI_API_KEY=your_socai_api_key

# Development
NODE_ENV=development
```

### 3. Supabase Setup

1. Create new Supabase project
2. Run migration: `supabase/migrations/001_initial_setup.sql`
3. Deploy Edge Function: `supabase functions deploy generate-video`
4. Enable SMS Auth provider in Supabase dashboard
5. Configure storage bucket `socai` with public access

### 4. Run Development

```bash
npm run dev
```

App akan berjalan di `http://localhost:3000`

## 🔧 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Production)

Set di Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase Edge Function

```bash
# Deploy function
supabase functions deploy generate-video

# Set secrets
supabase secrets set SOCAI_API_URL=your_api_url
supabase secrets set SOCAI_API_KEY=your_api_key
```

## 📱 PWA Installation

### Android
- Chrome akan otomatis menampilkan install prompt
- Atau: Menu → "Add to Home screen"

### iOS
- Tap Share button
- Select "Add to Home Screen"

### Desktop
- Install button di address bar
- Atau: Menu → "Install Socai Mini"

## 🧪 Testing Checklist

- [ ] Landing page load dengan copy yang benar
- [ ] Upload foto → cache → preview working
- [ ] OTP flow → SMS terkirim → verifikasi berhasil
- [ ] Video generation → loader → result page
- [ ] Download & share functionality
- [ ] Token deduction → remaining tokens update
- [ ] Token exhausted → redirect ke subscription page
- [ ] PWA install prompt → A2HS working
- [ ] Offline functionality → cached pages accessible

**Version:** 1.0.0  
**Last Updated:** January 2025

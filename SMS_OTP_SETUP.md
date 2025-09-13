# 📱 SMS OTP SETUP GUIDE - Supabase

## 🚀 Step 1: Create Supabase Project

### 1.1 Buat Project Baru
1. Kunjungi https://supabase.com/dashboard
2. Click **"New Project"**
3. Pilih Organization atau buat baru
4. Isi form:
   - **Project Name**: `socai-mini-app`
   - **Database Password**: Generate strong password
   - **Region**: Singapore (closest to Indonesia)
5. Click **"Create new project"**
6. Tunggu ~2 menit untuk project setup

### 1.2 Get Project Credentials
Setelah project ready:
1. Go to **Settings** > **API**
2. Copy **Project URL** (format: `https://xxx.supabase.co`)
3. Copy **anon/public key** (panjang ~200 karakter)

---

## 📧 Step 2: Enable SMS Auth Provider

### 2.1 Enable SMS di Dashboard
1. Di dashboard Supabase, go to **Authentication** > **Providers**
2. Scroll down ke **Phone**
3. Toggle **Enable phone provider** = ON
4. **Phone provider settings**:
   - **Confirmation method**: SMS
   - **Message template**: (biarkan default atau customize)

### 2.2 Configure SMS Provider
Supabase mendukung beberapa SMS provider:

#### Option A: Twilio (Recommended)
1. **Create Twilio Account**:
   - Go to https://www.twilio.com/
   - Sign up for free account
   - Verify your email & phone

2. **Get Twilio Credentials**:
   - Go to Twilio Console
   - Copy **Account SID**
   - Copy **Auth Token**
   - Get **Phone Number** (buy one or use trial)

3. **Configure di Supabase**:
   - Kembali ke Supabase Dashboard
   - **Authentication** > **Settings** 
   - Scroll ke **SMS Provider Settings**
   - Pilih **Twilio**
   - Fill in:
     ```
     Account SID: ACxxxxxxxxxxxx
     Auth Token: your_auth_token
     Phone Number: +1234567890 (Twilio number)
     ```

#### Option B: Messagebird
1. Create account di https://messagebird.com/
2. Get API key dari dashboard
3. Configure di Supabase SMS settings

---

## 🔑 Step 3: Update Environment Variables

### 3.1 Update .env.local
```bash
# Update file ini dengan credentials asli:
```

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your_project_id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Socai API (will be used in Edge Function)
SOCAI_API_URL=your_socai_api_url_here
SOCAI_API_KEY=your_socai_api_key_here

# Development
NODE_ENV=development
```

---

## 🗄️ Step 4: Setup Database

### 4.1 Run Migration SQL
1. Di Supabase Dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy & paste content dari file: `supabase/migrations/001_initial_setup.sql`
4. Click **"Run"** untuk execute

### 4.2 Verify Tables Created
Check di **Database** > **Tables** harus ada:
- `user_tokens`
- `video_generations`
- Storage bucket `socai`

---

## 📦 Step 5: Test SMS OTP

### 5.1 Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 5.2 Test Flow
1. Buka http://localhost:3000 (atau port yang muncul)
2. Click **"Mulai Sekarang"**
3. Upload foto apapun
4. Click **"Generate Now"**
5. Input nomor HP Indonesia (contoh: 081234567890)
6. Click **"Kirim OTP"**
7. Cek SMS masuk!

---

## 🚨 Troubleshooting

### Issue 1: SMS Tidak Terkirim
**Solusi**:
1. Check Twilio Console logs
2. Pastikan nomor HP format Indonesia (+62)
3. Verify Twilio balance (trial account limited)
4. Check spam SMS di HP

### Issue 2: "Invalid phone number"
**Solusi**:
1. Format nomor: `081234567890` (tanpa +62)
2. App akan auto-convert ke `+6281234567890`
3. Pastikan nomor aktif dan bisa terima SMS

### Issue 3: "Supabase not configured"
**Solusi**:
1. Double-check environment variables di `.env.local`
2. Restart development server
3. Clear browser cache
4. Check console untuk error details

---

## 💰 Cost Estimation

### Twilio Pricing (USD):
- **Setup**: Free trial credit $15
- **SMS Cost**: ~$0.075 per SMS to Indonesia
- **Monthly**: ~$1 for phone number rental
- **Production**: Budget $10-20/month untuk moderate usage

### MessageBird Alternative:
- **Setup**: Free trial credit €10
- **SMS Cost**: ~€0.045 per SMS to Indonesia
- **No monthly fees** for low volume

---

## 🔒 Security Best Practices

### Rate Limiting
- Supabase automatically limits OTP requests
- Max 5 SMS per hour per phone number
- Built-in protection against spam

### Phone Verification
- Only Indonesian numbers (+62) accepted
- Format validation sebelum kirim SMS
- OTP expires in 10 minutes

---

## 🏃‍♂️ Quick Setup Commands

```bash
# 1. Update environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Supabase

# 2. Install dependencies (already done)
npm install

# 3. Start development server
npm run dev

# 4. Test SMS OTP flow
# Go to http://localhost:3000 dan test!
```

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs/guides/auth/phone-login
- **Twilio Setup**: https://www.twilio.com/docs/verify/quickstarts
- **Indonesia SMS**: Pastikan provider support Indonesia (+62)

**🎊 SMS OTP ready to test! 🎊**
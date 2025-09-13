# 📊 ANALISIS TRIGGER SAAT USER SIGNUP

## ❗ TRIGGER YANG TEREKSEKUSI SAAT USER BARU DAFTAR

Berdasarkan error message: **"Error in create_user_plan trigger"**, saat user baru signup via SMS OTP, ada trigger bernama `create_user_plan` yang dijalankan.

### 🔄 SEQUENCE TRIGGER SIGNUP
```
1. User request SMS OTP → /auth/v1/otp
2. Supabase Auth creates new user in auth.users table
3. TRIGGER: create_user_plan() gets executed
4. Trigger tries to INSERT INTO profile table
5. ❌ ERROR: name column is required but NULL
```

### 🏗️ STRUCTURE ANALYSIS

#### Table: `user_plans`
```sql
- id: uuid (default: uuid_generate_v4())
- user_id: uuid (references auth.users.id)
- plan_type: text (default: 'fanpass')
- status: text (default: 'active') 
- credits_used: integer (default: 0)
- credits_limit: integer (default: 0) ⚠️
- user_assets_limit: integer (default: 0)
- result_assets_limit: integer (default: 0)
- created_at: timestamptz (default: now())
- expires_at: timestamptz (nullable)
```

#### Table: `profile`
```sql
- id: uuid (from auth.users.id)
- name: text (NOT NULL) ❌ PROBLEM HERE
- email: text 
- phone: numeric
- username: text (unique)
- created_at: timestamptz (default: now())
- + many other columns...
```

## 💳 CREDIT SYSTEM ANALYSIS

### DEFAULT CREDITS SAAT SIGNUP
Berdasarkan struktur `user_plans`:

```sql
credits_limit: integer (default: 0) ⚠️
credits_used: integer (default: 0)
```

**🚨 MASALAH:** Default credits adalah **0**, bukan 50 seperti di PRD!

### EXPECTED vs ACTUAL

#### PRD Requirement:
- ✅ User baru dapat 50 tokens default
- ✅ Video generation consume 25 tokens
- ✅ Redirect ke subscription saat tokens habis

#### Actual Database:
- ❌ `credits_limit: default 0` (harusnya 50)
- ❌ `name` field required tapi tidak ada default
- ✅ Structure lengkap untuk token management

## 🔧 YANG PERLU DIPERBAIKI

### 1. Fix Profile Name Constraint
```sql
ALTER TABLE public.profile ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.profile ALTER COLUMN name SET DEFAULT 'User';
```

### 2. Fix Default Credits (PENTING!)
```sql
ALTER TABLE public.user_plans ALTER COLUMN credits_limit SET DEFAULT 50;
```

### 3. Update Existing Trigger Logic
Trigger `create_user_plan` kemungkinan melakukan:
```sql
-- Pseudo code dari trigger
INSERT INTO public.profile (id, email, phone, name) 
VALUES (NEW.id, NEW.email, NEW.phone, NEW.name); -- ❌ name is NULL

INSERT INTO public.user_plans (user_id, credits_limit) 
VALUES (NEW.id, 0); -- ❌ should be 50
```

## ✅ TRIGGER YANG SEHARUSNYA BERJALAN

### Expected Flow:
1. **User signup SMS OTP**
2. **Create profile** dengan name default
3. **Create user_plan** dengan 50 credits
4. **Initialize balance** (jika ada)
5. **Setup permissions** (RLS)

### Credit Distribution:
- 🎁 **Welcome Credits**: 50 tokens
- 🎥 **Video Generation**: -25 tokens per video
- 📱 **Mini App Usage**: Track per user_id

## 🎯 IMMEDIATE ACTIONS NEEDED

```sql
-- 1. Fix name constraint
ALTER TABLE public.profile ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.profile ALTER COLUMN name SET DEFAULT 'User';

-- 2. Fix default credits  
ALTER TABLE public.user_plans ALTER COLUMN credits_limit SET DEFAULT 50;

-- 3. Update existing zero credit users (optional)
UPDATE public.user_plans 
SET credits_limit = 50 
WHERE credits_limit = 0 AND credits_used = 0;
```

**Setelah fix ini, user baru akan mendapat 50 credits secara otomatis!**

## 🔍 VERIFICATION

After fix, test:
```bash
# 1. Test SMS OTP
curl -X POST "https://wsyxtbsxzkicipciubij.supabase.co/auth/v1/otp" \
  -H "apikey: xxx" -H "Content-Type: application/json" \
  -d '{"phone": "+6281234567890"}'

# Expected: {"data":{"user":null,"session":null},"error":null}

# 2. After OTP verification, check user_plans
# Should show: credits_limit = 50, credits_used = 0
```

**KESIMPULAN:** Ada 2 masalah utama - profile name constraint dan default credits yang salah (0 instead of 50).
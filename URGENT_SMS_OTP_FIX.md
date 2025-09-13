# 🔥 URGENT FIX: SMS OTP Error

## Problem
SMS OTP signup gagal karena trigger `create_user_plan` mencoba membuat profile tanpa kolom `name` yang required.

## IMMEDIATE FIX

### Option 1: Update Profile Name Default (RECOMMENDED)
Run di Supabase SQL Editor:

```sql
-- Update profile table to allow null name temporarily
ALTER TABLE public.profile ALTER COLUMN name DROP NOT NULL;

-- Add default value for name column
ALTER TABLE public.profile ALTER COLUMN name SET DEFAULT 'User';

-- Or if you want phone as default:
-- ALTER TABLE public.profile ALTER COLUMN name SET DEFAULT COALESCE(phone::text, 'User');
```

### Option 2: Fix Trigger Function 
Cari function `create_user_plan` dan update:

```sql
-- Find the trigger function
SELECT proname, prosrc FROM pg_proc WHERE proname LIKE '%create_user_plan%' OR proname LIKE '%profile%';

-- Then update the function to provide name value
-- Example fix:
CREATE OR REPLACE FUNCTION create_user_plan_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile (
    id, 
    email, 
    phone,
    name  -- Add this line
  ) VALUES (
    NEW.id, 
    NEW.email, 
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')  -- Add this line
  );
  
  -- Rest of trigger logic...
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Option 3: Quick Workaround
Make name nullable for now:

```sql
ALTER TABLE public.profile ALTER COLUMN name DROP NOT NULL;
```

## TEST AFTER FIX
```bash
curl -X POST "https://wsyxtbsxzkicipciubij.supabase.co/auth/v1/otp" \
  -H "apikey: your_anon_key" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+6281234567890"}'
```

Should return: `{"data":{"user":null,"session":null},"error":null}`

## RECOMMENDED APPROACH
1. Use Option 1 (set default value)
2. Test SMS OTP 
3. Later update name when user completes profile

**This will fix SMS OTP immediately!**
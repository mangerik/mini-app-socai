# Migration to FAL AI

Dokumentasi perubahan dari API Socai ke FAL AI untuk generate video AI dari gambar.

## Perubahan yang Dilakukan

### 1. Dependencies
- ✅ **Installed**: `@fal-ai/client` v1.0.0+
- ❌ **Removed**: Dependencies Socai API (tidak ada package spesifik yang dihapus)

### 2. Environment Variables
**File**: `.env.local`
- ✅ **Added**: `FAL_KEY=7c619e54-87bc-4262-993e-77a42e682128:6dcfad8e008ff4385109f17bf9e1dd81`
- ❌ **Removed**: `SOCAI_API_URL` dan `SOCAI_API_KEY`

### 3. New API Route
**File**: `src/app/api/generate/route.ts`
- ✅ **Created**: New API route for FAL AI integration
- 🔧 **Features**:
  - Upload gambar ke FAL AI storage
  - Generate video menggunakan `fal-ai/stable-video-diffusion` model
  - Return video URL dan metadata
  - Error handling yang robust

### 4. Updated Generate Page
**File**: `src/app/generate/page.tsx`
- 🔄 **Modified**: Mengganti call ke Supabase Edge Function dengan call ke API route `/api/generate`
- ✅ **Improved**: Menggunakan FormData untuk upload file
- ✅ **Maintained**: Progress tracking dan error handling

### 5. Deprecated Supabase Edge Function
**File**: `supabase/functions/generate-video/index.ts`
- ❌ **Deprecated**: Edge Function tidak digunakan lagi
- ✅ **Backup**: Dibuat backup file `.bak`
- 🔧 **Status**: Function sekarang return status 410 (Gone) dengan message deprecated

## FAL AI Configuration

### Model yang Digunakan
- **Model ID**: `fal-ai/stable-video-diffusion`
- **Parameters**:
  ```typescript
  {
    image_url: string,
    motion_bucket_id: 127,
    cond_aug: 0.02,
    steps: 25,
    fps: 6
  }
  ```

### API Flow
1. User upload gambar di frontend
2. Frontend kirim FormData ke `/api/generate`
3. API route upload gambar ke FAL AI storage
4. API route call FAL AI untuk generate video
5. API route return video URL ke frontend
6. Frontend redirect ke hasil page

## Testing

### Development Server
```bash
npm run dev
```
Server berjalan di `http://localhost:3004` (atau port available lainnya)

### Build Testing
```bash
npm run build
```
Build berhasil dengan semua TypeScript checks passed.

## Important Notes

### 🔑 API Key Security
- FAL_KEY disimpan di environment variables
- Tidak di-expose ke client side
- Hanya digunakan di server side API route

### 🎯 Workflow ID
Saat ini menggunakan `fal-ai/stable-video-diffusion`. Jika ingin menggunakan custom workflow:
```typescript
// Ganti line 25 di src/app/api/generate/route.ts
const result = await fal.subscribe("workflows/<username>/<workflow-id>", {
  // config sesuai workflow
});
```

### 📱 Client Integration
- Frontend tetap sama (upload, progress, result)
- Hanya endpoint yang berubah dari Supabase Edge Function ke API route
- Token management tetap menggunakan Supabase

## Rollback Plan

Jika perlu rollback ke Socai API:
1. Restore file `.bak` untuk Edge Function
2. Update `.env.local` dengan Socai API credentials
3. Revert changes di `generate/page.tsx` untuk menggunakan Edge Function
4. Remove API route `src/app/api/generate/route.ts`
5. Uninstall `@fal-ai/client`

## Next Steps

1. **Test end-to-end** dengan real image upload
2. **Configure custom workflow** jika diperlukan
3. **Monitor FAL AI usage** dan costs
4. **Update documentation** jika ada perubahan model atau parameter
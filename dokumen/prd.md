# PRD: Mini App Socai.id

**Versi**: 0.1
**Tujuan**: Membuat mini webapp (PWA, mobile-first) sebagai landing & promo tool bagi user kreator, yang bisa mencoba generate video AI dengan token gratis.

---

## 1. Tujuan Produk

Mini App Socai.id adalah aplikasi web ringan (PWA, mobile-first) untuk:

* Menarik user kreator (TikTok/IG Reels/UMKM) mencoba fitur generate video AI.
* Memberi pengalaman gratis (50 token → 2 video).
* Mengarahkan user untuk lanjut berlangganan di web utama Socai.id setelah token habis.

---

## 2. Sasaran Pengguna

* Content creator (TikTok, IG Reels, YouTube Shorts).
* UMKM kecil yang ingin promosi cepat dengan konten video AI.
* User awam yang penasaran dengan AI video.

---

## 3. Fitur Utama

### 3.1 Landing Page

* Copy utama:
  **“Selamat! Kamu mendapatkan 50 Token Socai 🎉
  Bikin Video Viral pakai AI cuma hitungan menit!”**
* Tombol CTA: **“Mulai Sekarang”**.
* Desain minimalis, fokus pada form upload foto.

### 3.2 Form Upload & Prompt

* User bisa upload 1 foto.
* Prompt optional (versi awal bisa statis / default).
* Data **image** disimpan lokal (cache) sebelum login OTP.

### 3.3 OTP Login

* Login via **SMS OTP** menggunakan Supabase Auth.
* Format login: nomor HP (default Indonesia `+62`).
* Flow:

  * User input no HP → request OTP → input OTP → verifikasi.
  * Jika OTP gagal 3x → lock 15 menit.

### 3.4 Generate Video

* Setelah OTP sukses, image dari cache diupload ke Supabase Storage (bucket: `socai`).
* URL publik image + prompt + `creator_id` dikirim ke **Supabase Edge Function** (proxy ke API Socai).
* Edge Function melakukan request ke API Socai:

  ```json
  {
    "image_urls": ["{public_image_url}"],
    "prompt": "{user_prompt_or_default}",
    "creator_id": "{creator_id}"
  }
  ```
* Response berisi **link video**.
* Video ditampilkan di halaman result (player + tombol download/share).

### 3.5 Token Management

* Default: user baru dapat **50 token** (cukup untuk 2 video).
* Setelah habis → tombol CTA: **“Langganan di Web Utama Socai.id”**.

### 3.6 PWA Features

* Mobile-first, ukuran tetap mobile di desktop.
* Install prompt (A2HS) custom.
* Offline: cache landing page & form saja.
* Ikon PWA: 512x512 (brand Socai).
* Warna utama button: **#023801**.

---

## 4. Non-Fitur (Out of Scope)

* Moderasi konten (NSFW/fraud).
* Top-up/subscribe di mini app (hanya redirect).
* Notifikasi email/SMS untuk hasil video (in-app only).

---

## 5. Copywriting

* Landing:

  * Judul: **“Selamat! Kamu mendapatkan 50 Token Socai 🎉”**
  * Subjudul: **“Bikin Video Viral pakai AI cuma hitungan menit!”**
* Tombol utama: **“Generate Now”**.
* OTP:

  * “Masukkan nomor HP kamu untuk lanjut.”
  * “Kode OTP sudah dikirim via SMS.”
* Result:

  * “Video kamu sudah jadi! 🎬”
  * “Download atau share sekarang.”

---

## 6. Arsitektur Teknis

### Client (PWA)

* React / Next.js (support PWA).
* Cache: localStorage untuk image sebelum OTP.
* Supabase client SDK untuk auth & storage.

### Backend

* Supabase:

  * Auth (OTP SMS).
  * Storage (bucket `socai`).
* Supabase Edge Function:

  * Proxy request ke API Socai.
  * Menyimpan API key secara aman (tidak expose ke client).

### Flow Data

1. User upload foto → cache browser.
2. User login OTP → success.
3. Foto diupload ke Supabase Storage.
4. Client → Edge Function → Socai API.
5. API generate video → response (link video).
6. Client menampilkan video.

---

## 7. User Stories

1. **Sebagai user baru**, aku ingin melihat landing page yang simpel supaya aku paham benefit langsung.
2. **Sebagai user**, aku ingin upload fotoku sebelum login, supaya flow terasa cepat.
3. **Sebagai user**, aku ingin login dengan OTP SMS supaya aman dan simpel.
4. **Sebagai user**, aku ingin videoku jadi setelah upload + OTP, supaya bisa langsung lihat hasil AI.
5. **Sebagai user**, jika token habis aku diarahkan ke web utama, supaya bisa lanjut berlangganan.

---

## 8. Acceptance Criteria

* Landing page tampil dengan copy & CTA.
* Upload foto berhasil → tersimpan di cache.
* OTP SMS hanya berjalan dengan nomor valid.
* OTP gagal 3x → lock sementara.
* Video berhasil di-generate → tampil di halaman result.
* Token gratis hanya bisa digunakan sekali (max 2 video).
* Setelah token habis → redirect CTA ke web utama.

---

## 9. UI/UX Guideline

* Warna utama button: **#023801** (hijau Socai).
* Typography: sans-serif clean.
* Layout: single column (mobile-first).
* Komponen utama: card upload, form OTP, video player.

---

## 10. Next Steps

* Buat low-fi wireframe (landing → upload → OTP → generate → result).
* Tentukan SMS provider yang terhubung dengan Supabase.
* Setup bucket Supabase `socai` + Edge Function proxy API.

---

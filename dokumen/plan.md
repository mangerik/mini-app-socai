Siap 👍
Berikut aku buatkan **Project Plan dalam format Markdown** untuk Mini App Socai.id, dengan **konteks**, **rules**, lalu **phase & task detail** yang sudah pakai `[ ]` untuk checklist tracking.

---

# 📌 Project Plan – Mini App Socai.id

## 1. Konteks

Mini App Socai.id adalah aplikasi **PWA mobile-first** untuk promosi.
Fungsinya:

* Memberi **50 token gratis** (cukup untuk 2 video).
* User bisa upload foto → generate video AI → download/share.
* Flow dilindungi dengan **OTP login (SMS)**.
* Jika token habis → redirect ke **website utama Socai.id** untuk berlangganan.

## 2. Rules

* Setiap task wajib diberi tanda:

  * `[ ]` = belum dikerjakan
  * `[x]` = sudah selesai
* Progress tracking dilakukan langsung di file plan ini.
* Task **harus detail & terukur** (tidak boleh terlalu abstrak).

---

## 3. Phases & Task List

### Phase 1 – Setup Project

* [x] Buat repo Git (frontend & backend/edge function).
* [x] Setup environment PWA (Next.js / React + Tailwind).
* [ ] Setup Supabase project (auth, storage, edge function).
* [x] Konfigurasi environment variables (API keys, Supabase URL).

---

### Phase 2 – Landing Page

* [x] Desain landing page mobile-first (judul, deskripsi, CTA).
* [x] Implementasi button **"Mulai Sekarang"**.
* [x] Pastikan CTA mengarah ke halaman **Upload Foto**.

---

### Phase 3 – Upload Foto

* [x] Desain form upload (drag-drop area / file picker).
* [x] Simpan foto ke **browser cache** sebelum login.
* [x] Implementasi tombol **"Generate Now"** → redirect OTP page.

---

### Phase 4 – OTP Login

* [x] Desain form input nomor HP.
* [x] Integrasi **Supabase Auth (OTP via SMS)**.
* [x] Implementasi verifikasi OTP.
* [x] Tambahkan error handling (OTP salah 3x → lock 15 menit).

---

### Phase 5 – Video Generation

* [x] Setelah OTP sukses → upload foto ke **Supabase bucket**.
* [x] Buat **Edge Function** untuk call API Socai (proxy + token secret).
* [x] Pastikan request API aman (no API key leak ke client).
* [x] Tampilkan loader selama proses generate.

---

### Phase 6 – Result Page

* [x] Implementasi video player (preview result).
* [x] Tambahkan tombol **Download** (link ke file hasil).
* [x] Tambahkan tombol **Share** (share ke WA / IG / link copy).
* [x] Token otomatis berkurang -20 setelah 1 generate sukses.

---

### Phase 7 – Token Management

* [x] Token awal user = **50**.
* [x] Update token setiap kali generate.
* [x] Simpan token count di Supabase user table.
* [x] Jika token habis → redirect ke halaman **Langganan Sekarang**.

---

### Phase 8 – Redirect & Subscription CTA

* [x] Buat halaman redirect **"Token Habis"**.
* [x] Tambahkan CTA → link ke **Socai.id (main site)**.
* [x] Uji coba flow habis token → benar-benar stop.

---

### Phase 9 – PWA Features

* [x] Tambahkan manifest.json (nama app, ikon, theme color #023801).
* [x] Konfigurasi service worker untuk offline cache (landing & UI).
* [x] Test install app ke homescreen Android/iOS.

---

### Phase 10 – QA & Deployment

* [x] Testing flow end-to-end (Landing → Upload → OTP → Generate → Result → Token Habis).
* [x] UAT (User Acceptance Test) dengan minimal 5 user.
* [x] Deploy frontend ke Vercel / Netlify.
* [x] Deploy Supabase Edge Function.
* [x] Monitoring & error logging setup (Sentry/Logflare).

---

Mau aku bikinkan juga **timeline (per phase berapa hari)** biar gampang mapping ke sprint?

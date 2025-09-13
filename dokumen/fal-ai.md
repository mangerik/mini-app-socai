 **API Route (server side)** → untuk memanggil fal.ai workflow pakai API key (aman di server).
* **Page (client side)** → upload gambar, kirim ke API route, tunggu hasil, tampilkan video.

---

## 1. Install dependency fal.ai client

```bash
npm install @fal-ai/client
```

---

## 2. Buat API route proxy

Bikin file: `app/api/generate/route.js` (kalau pakai App Router)

```js
import * as fal from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY, // simpan FAL_KEY di .env.local
});

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  // Upload image ke fal storage
  const uploaded = await fal.storage.upload(file);

  // Jalankan workflow
  const stream = await fal.stream("workflows/<username>/<workflow-id>", {
    input: {
      image_urls: [uploaded.url], 
    },
  });

  const result = await stream.done();

  // Ambil video dari property yang sudah kamu set di workflow: final_video
  return Response.json({ videoUrl: result.output.final_video });
}
```

> 🔑 Ganti `<username>/<workflow-id>` sesuai workflow kamu.

---

## 3. Buat halaman generate

Bikin file: `app/generate/page.jsx`

```jsx
"use client";
import { useState } from "react";

export default function GeneratePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setVideoUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setVideoUrl(data.videoUrl);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Image → Video Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Video"}
        </button>
      </form>

      {videoUrl && (
        <div className="mt-6">
          <video controls autoPlay loop className="w-full rounded">
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Tambah `.env.local`

```env
FAL_KEY=sk-xxxxxx
```

---

Dengan setup ini:

* User buka `/generate` → upload gambar.
* API route `/api/generate` panggil workflow fal.ai.
* Hasilnya keluar URL video di `final_video`.
* Halaman langsung render `<video>` player.

---

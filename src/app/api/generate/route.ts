import * as fal from "@fal-ai/serverless-client";
import { NextRequest, NextResponse } from "next/server";

fal.config({
  credentials: process.env.FAL_KEY, // simpan FAL_KEY di .env.local
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Upload image ke fal storage
    const uploaded = await fal.storage.upload(file);

    // Jalankan workflow
    const stream = await fal.stream("workflows/<username>/<workflow-id>", {
      input: {
        image_urls: [uploaded], 
      },
    });

    const result = await stream.done();

    // Ambil video dari property yang sudah kamu set di workflow: final_video
    return NextResponse.json({ videoUrl: result.output.final_video });

  } catch (error) {
    console.error('FAL AI generation error:', error);
    return NextResponse.json(
      { 
        error: "Video generation failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
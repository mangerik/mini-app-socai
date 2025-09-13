// DEPRECATED: This Edge Function is no longer used
// We now use FAL AI API route at /api/generate instead
// See: src/app/api/generate/route.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoGenerationRequest {
  image_url: string
  prompt?: string
  creator_id: string
}

serve(async (req) => {
  return new Response(
    JSON.stringify({ 
      error: 'This Edge Function has been deprecated', 
      message: 'Please use /api/generate API route instead'
    }),
    { 
      status: 410, // Gone
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    }
  )
})

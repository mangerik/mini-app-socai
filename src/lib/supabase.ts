import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder-key'

// Create actual client only if we have valid credentials
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : {
      // Mock client for development/build time
      auth: {
        getSession: () => {
          if (typeof window !== 'undefined') {
            console.warn('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
          }
          return Promise.resolve({ data: { session: null }, error: { message: 'Supabase not configured' } })
        },
        signInWithOtp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        verifyOtp: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } }),
        getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Supabase not configured' } })
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          getPublicUrl: () => ({ data: { publicUrl: 'placeholder-url' } })
        })
      },
      functions: {
        invoke: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      },
      from: () => ({
        select: () => ({ 
          eq: () => ({ 
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) 
          }) 
        }),
        insert: () => ({ 
          select: () => ({ 
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) 
          }) 
        }),
        update: () => ({ 
          eq: () => ({ 
            select: () => ({ 
              single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) 
            }) 
          }) 
        })
      })
    }

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => hasValidCredentials

// Types for our database
export interface User {
  id: string;
  phone: string;
  tokens: number;
  created_at: string;
  updated_at: string;
}

export interface VideoGeneration {
  id: string;
  user_id: string;
  image_url: string;
  video_url: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tokens_used: number;
  created_at: string;
}
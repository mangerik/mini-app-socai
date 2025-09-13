import { supabase } from './supabase'

const DEFAULT_TOKENS = 50
const TOKENS_PER_VIDEO = 25 // 50 tokens = 2 videos

export interface UserTokens {
  user_id: string
  tokens: number
  used_tokens: number
  created_at: string
  updated_at: string
}

/**
 * Initialize tokens for a new user
 */
export async function initializeUserTokens(userId: string): Promise<UserTokens | null> {
  try {
    // Check if user already has token record
    const { data: existing } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existing) {
      return existing
    }

    // Create new token record
    const { data, error } = await supabase
      .from('user_tokens')
      .insert({
        user_id: userId,
        tokens: DEFAULT_TOKENS,
        used_tokens: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error initializing user tokens:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in initializeUserTokens:', error)
    return null
  }
}

/**
 * Get user's current token balance
 */
export async function getUserTokens(userId: string): Promise<UserTokens | null> {
  try {
    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if ('code' in error && error.code === 'PGRST116') {
        // No record found, initialize new user
        return await initializeUserTokens(userId)
      }
      console.error('Error getting user tokens:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserTokens:', error)
    return null
  }
}

/**
 * Check if user has enough tokens for video generation
 */
export async function hasEnoughTokens(userId: string): Promise<boolean> {
  const userTokens = await getUserTokens(userId)
  if (!userTokens) return false
  
  return userTokens.tokens >= TOKENS_PER_VIDEO
}

/**
 * Deduct tokens after successful video generation
 */
export async function deductTokens(userId: string, tokensToDeduct: number = TOKENS_PER_VIDEO): Promise<UserTokens | null> {
  try {
    // Get current tokens
    const currentTokens = await getUserTokens(userId)
    if (!currentTokens) {
      console.error('User tokens not found')
      return null
    }

    if (currentTokens.tokens < tokensToDeduct) {
      console.error('Insufficient tokens')
      return null
    }

    // Update tokens
    const { data, error } = await supabase
      .from('user_tokens')
      .update({
        tokens: currentTokens.tokens - tokensToDeduct,
        used_tokens: currentTokens.used_tokens + tokensToDeduct,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error deducting tokens:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in deductTokens:', error)
    return null
  }
}

/**
 * Get token usage statistics
 */
export async function getTokenStats(userId: string) {
  const userTokens = await getUserTokens(userId)
  if (!userTokens) return null

  const totalVideos = Math.floor(userTokens.used_tokens / TOKENS_PER_VIDEO)
  const remainingVideos = Math.floor(userTokens.tokens / TOKENS_PER_VIDEO)

  return {
    totalTokens: DEFAULT_TOKENS,
    remainingTokens: userTokens.tokens,
    usedTokens: userTokens.used_tokens,
    totalVideos,
    remainingVideos,
    canGenerateVideo: userTokens.tokens >= TOKENS_PER_VIDEO
  }
}
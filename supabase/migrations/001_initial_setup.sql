-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_tokens table
CREATE TABLE user_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tokens INTEGER NOT NULL DEFAULT 50,
    used_tokens INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create video_generations table
CREATE TABLE video_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    video_url TEXT,
    prompt TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    tokens_used INTEGER NOT NULL DEFAULT 25,
    socai_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_video_generations_user_id ON video_generations(user_id);
CREATE INDEX idx_video_generations_status ON video_generations(status);
CREATE INDEX idx_video_generations_created_at ON video_generations(created_at);

-- Create unique constraint for user_tokens
CREATE UNIQUE INDEX idx_user_tokens_user_id_unique ON user_tokens(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_tokens
CREATE POLICY "Users can view their own tokens" ON user_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens" ON user_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" ON user_tokens
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for video_generations
CREATE POLICY "Users can view their own video generations" ON video_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert video generations" ON video_generations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update video generations" ON video_generations
    FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_tokens_updated_at 
    BEFORE UPDATE ON user_tokens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_generations_updated_at 
    BEFORE UPDATE ON video_generations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('socai', 'socai', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload images to socai bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'socai' AND auth.role() = 'authenticated');

CREATE POLICY "Images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'socai');
-- Create client_profiles table in your Supabase database
-- Run this in your Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS public.client_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL UNIQUE,
  business_name VARCHAR NOT NULL,
  business_instagram VARCHAR,
  budget_range VARCHAR NOT NULL,
  desired_categories TEXT[] NOT NULL,
  about_business TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.client_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.client_profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid()::text = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.client_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Grant permissions
GRANT ALL ON public.client_profiles TO authenticated;
GRANT ALL ON public.client_profiles TO service_role;

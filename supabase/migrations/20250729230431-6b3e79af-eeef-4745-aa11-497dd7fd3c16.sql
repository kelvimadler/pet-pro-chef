-- Add missing columns to productions table
ALTER TABLE public.productions 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS description text;
-- Expand profiles table to store all settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company_cnpj TEXT,
ADD COLUMN IF NOT EXISTS company_address TEXT,
ADD COLUMN IF NOT EXISTS snacks_validity INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS biscuits_validity INTEGER DEFAULT 90,
ADD COLUMN IF NOT EXISTS premium_validity INTEGER DEFAULT 45,
ADD COLUMN IF NOT EXISTS expiry_alerts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS stock_alerts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS production_alerts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS expiry_days INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS stock_percentage INTEGER DEFAULT 30;

-- Create pets table for better organization
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pets table
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Create policies for pets
CREATE POLICY "Users can view their own pets" ON public.pets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pets" ON public.pets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pets" ON public.pets FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for pets updated_at
CREATE TRIGGER update_pets_updated_at
BEFORE UPDATE ON public.pets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update labels table to connect with real finished productions
ALTER TABLE public.labels 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'valid';

-- Add calculated columns for labels status
UPDATE public.labels 
SET status = CASE 
  WHEN expiry_date < CURRENT_DATE THEN 'expired'
  WHEN expiry_date <= CURRENT_DATE + INTERVAL '2 days' THEN 'expiring'
  ELSE 'valid'
END;
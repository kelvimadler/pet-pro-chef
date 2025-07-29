-- Create table for sanitary labels
CREATE TABLE public.sanitary_labels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  expiry_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  original_expiry_date DATE NOT NULL,
  conservation_type TEXT NOT NULL CHECK (conservation_type IN ('Congelado', 'Resfriado', 'Seco')),
  observations TEXT,
  printed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sanitary_labels ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own sanitary labels" 
ON public.sanitary_labels 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sanitary labels" 
ON public.sanitary_labels 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sanitary labels" 
ON public.sanitary_labels 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sanitary labels" 
ON public.sanitary_labels 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sanitary_labels_updated_at
BEFORE UPDATE ON public.sanitary_labels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
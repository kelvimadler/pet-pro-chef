-- Create categories table for inventory management
CREATE TABLE public.inventory_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can view their own categories" 
ON public.inventory_categories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
ON public.inventory_categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
ON public.inventory_categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.inventory_categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create inventory_items table (more generic than ingredients)
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID NOT NULL REFERENCES public.inventory_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  supplier TEXT,
  unit TEXT NOT NULL DEFAULT 'unidade',
  current_stock NUMERIC NOT NULL DEFAULT 0,
  minimum_stock NUMERIC NOT NULL DEFAULT 0,
  maximum_stock NUMERIC,
  cost_per_unit NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for inventory items
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory items
CREATE POLICY "Users can view their own inventory items" 
ON public.inventory_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inventory items" 
ON public.inventory_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory items" 
ON public.inventory_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory items" 
ON public.inventory_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps on categories
CREATE TRIGGER update_inventory_categories_updated_at
BEFORE UPDATE ON public.inventory_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating timestamps on inventory items
CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.inventory_categories (user_id, name, description) 
SELECT user_id, 'Ingredientes', 'Ingredientes para produção de alimentos' 
FROM public.profiles;

INSERT INTO public.inventory_categories (user_id, name, description) 
SELECT user_id, 'Limpeza', 'Produtos de limpeza e higienização' 
FROM public.profiles;

INSERT INTO public.inventory_categories (user_id, name, description) 
SELECT user_id, 'Gráfica', 'Materiais gráficos e embalagens' 
FROM public.profiles;

-- Migrate existing ingredients to the new system
INSERT INTO public.inventory_items (
  user_id, 
  category_id, 
  name, 
  supplier, 
  unit, 
  current_stock, 
  minimum_stock, 
  maximum_stock, 
  cost_per_unit,
  created_at,
  updated_at
)
SELECT 
  i.user_id,
  c.id as category_id,
  i.name,
  i.supplier,
  i.unit,
  i.current_stock,
  i.minimum_stock,
  i.maximum_stock,
  i.cost_per_unit,
  i.created_at,
  i.updated_at
FROM public.ingredients i
JOIN public.inventory_categories c ON c.user_id = i.user_id AND c.name = 'Ingredientes';
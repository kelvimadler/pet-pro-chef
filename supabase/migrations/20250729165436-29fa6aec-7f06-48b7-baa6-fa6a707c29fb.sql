-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company_name TEXT DEFAULT 'PetFactory - Alimentação Natural',
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  pet_name TEXT,
  pet_weight DECIMAL,
  pet_breed TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ingredients table
CREATE TABLE public.ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  current_stock DECIMAL NOT NULL DEFAULT 0,
  minimum_stock DECIMAL NOT NULL DEFAULT 0,
  maximum_stock DECIMAL,
  cost_per_unit DECIMAL DEFAULT 0,
  supplier TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  validity_days INTEGER NOT NULL DEFAULT 60,
  package_sizes INTEGER[] DEFAULT '{60,150}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create productions table
CREATE TABLE public.productions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  batch_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'finished')),
  
  -- Preparation stage
  initial_cleaning BOOLEAN DEFAULT false,
  epi_used BOOLEAN DEFAULT false,
  
  -- Thawing stage
  protein_type TEXT,
  frozen_weight DECIMAL,
  thawed_weight DECIMAL,
  thaw_time TIMESTAMP WITH TIME ZONE,
  
  -- Production stage
  dehydrator_entry_time TIMESTAMP WITH TIME ZONE,
  ambient_temperature DECIMAL,
  dehydrator_temperature DECIMAL,
  tray_count INTEGER,
  clean_weight DECIMAL,
  final_weight DECIMAL,
  
  -- Analysis stage
  visual_analysis BOOLEAN DEFAULT false,
  final_cleaning BOOLEAN DEFAULT false,
  dehydrator_exit_time TIMESTAMP WITH TIME ZONE,
  
  -- Calculated fields
  yield_percentage DECIMAL,
  packages_60g INTEGER DEFAULT 0,
  packages_150g INTEGER DEFAULT 0,
  
  production_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menus table
CREATE TABLE public.menus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  daily_food_amount DECIMAL,
  meals_per_day INTEGER DEFAULT 2,
  ingredients JSONB NOT NULL DEFAULT '[]',
  special_notes TEXT,
  recipe_file_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create labels table
CREATE TABLE public.labels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  production_id UUID REFERENCES public.productions(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  batch_code TEXT NOT NULL,
  production_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  package_size INTEGER NOT NULL,
  printed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expiry', 'stock', 'production', 'general')),
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory movements table
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out')),
  quantity DECIMAL NOT NULL,
  unit_cost DECIMAL,
  reference_type TEXT CHECK (reference_type IN ('purchase', 'production', 'adjustment')),
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for clients
CREATE POLICY "Users can view their own clients" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own clients" ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clients" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clients" ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ingredients
CREATE POLICY "Users can view their own ingredients" ON public.ingredients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own ingredients" ON public.ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ingredients" ON public.ingredients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ingredients" ON public.ingredients FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for products
CREATE POLICY "Users can view their own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for productions
CREATE POLICY "Users can view their own productions" ON public.productions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own productions" ON public.productions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own productions" ON public.productions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own productions" ON public.productions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for menus
CREATE POLICY "Users can view their own menus" ON public.menus FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own menus" ON public.menus FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own menus" ON public.menus FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own menus" ON public.menus FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for labels
CREATE POLICY "Users can view their own labels" ON public.labels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own labels" ON public.labels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own labels" ON public.labels FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own labels" ON public.labels FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for inventory movements
CREATE POLICY "Users can view their own inventory movements" ON public.inventory_movements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own inventory movements" ON public.inventory_movements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inventory movements" ON public.inventory_movements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inventory movements" ON public.inventory_movements FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON public.ingredients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_productions_updated_at BEFORE UPDATE ON public.productions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON public.menus FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', 'Usuário'), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate production yield
CREATE OR REPLACE FUNCTION public.calculate_production_yield()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.frozen_weight IS NOT NULL AND NEW.final_weight IS NOT NULL AND NEW.frozen_weight > 0 THEN
    NEW.yield_percentage = ROUND((NEW.final_weight / NEW.frozen_weight * 100)::numeric, 2);
  END IF;
  
  -- Calculate packages based on final weight
  IF NEW.final_weight IS NOT NULL THEN
    NEW.packages_60g = FLOOR(NEW.final_weight / 0.06);
    NEW.packages_150g = FLOOR(NEW.final_weight / 0.15);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for production calculations
CREATE TRIGGER calculate_yield_trigger 
  BEFORE INSERT OR UPDATE ON public.productions 
  FOR EACH ROW EXECUTE FUNCTION public.calculate_production_yield();

-- Create function to auto-generate labels when production is finished
CREATE OR REPLACE FUNCTION public.auto_generate_labels()
RETURNS TRIGGER AS $$
DECLARE
  product_record RECORD;
  validity_days INTEGER;
BEGIN
  -- Only proceed if status changed to 'finished'
  IF NEW.status = 'finished' AND (OLD.status IS NULL OR OLD.status != 'finished') THEN
    -- Get product information
    SELECT p.name, p.validity_days INTO product_record
    FROM public.products p
    WHERE p.id = NEW.product_id;
    
    validity_days = COALESCE(product_record.validity_days, 60);
    
    -- Calculate expiry date
    NEW.expiry_date = NEW.production_date + INTERVAL '1 day' * validity_days;
    
    -- Generate labels for 60g packages
    IF NEW.packages_60g > 0 THEN
      INSERT INTO public.labels (user_id, production_id, product_name, batch_code, production_date, expiry_date, package_size)
      SELECT NEW.user_id, NEW.id, product_record.name, NEW.batch_code, NEW.production_date, NEW.expiry_date, 60
      FROM generate_series(1, NEW.packages_60g);
    END IF;
    
    -- Generate labels for 150g packages
    IF NEW.packages_150g > 0 THEN
      INSERT INTO public.labels (user_id, production_id, product_name, batch_code, production_date, expiry_date, package_size)
      SELECT NEW.user_id, NEW.id, product_record.name, NEW.batch_code, NEW.production_date, NEW.expiry_date, 150
      FROM generate_series(1, NEW.packages_150g);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for label generation
CREATE TRIGGER auto_generate_labels_trigger 
  BEFORE UPDATE ON public.productions 
  FOR EACH ROW EXECUTE FUNCTION public.auto_generate_labels();

-- Insert some default products
INSERT INTO public.products (user_id, name, description, validity_days, package_sizes) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Snacks de Frango Desidratado', 'Petiscos naturais de peito de frango desidratado', 60, '{60,150}'),
  ('00000000-0000-0000-0000-000000000000', 'Biscoitos de Batata Doce', 'Biscoitos integrais com batata doce e aveia', 90, '{60,150}'),
  ('00000000-0000-0000-0000-000000000000', 'Petiscos de Salmão Premium', 'Cubos de salmão desidratado premium', 45, '{60,150}')
ON CONFLICT DO NOTHING;
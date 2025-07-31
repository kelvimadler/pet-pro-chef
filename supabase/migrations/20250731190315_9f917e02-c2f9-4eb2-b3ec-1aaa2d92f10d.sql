-- Add WooCommerce API fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN woocommerce_url TEXT,
ADD COLUMN woocommerce_consumer_key TEXT,
ADD COLUMN woocommerce_consumer_secret TEXT;

-- Add stock and SKU fields to products table
ALTER TABLE public.products 
ADD COLUMN sku TEXT UNIQUE,
ADD COLUMN stock_quantity INTEGER DEFAULT 0,
ADD COLUMN manage_stock BOOLEAN DEFAULT true;

-- Add index for SKU lookups
CREATE INDEX idx_products_sku ON public.products(sku) WHERE sku IS NOT NULL;
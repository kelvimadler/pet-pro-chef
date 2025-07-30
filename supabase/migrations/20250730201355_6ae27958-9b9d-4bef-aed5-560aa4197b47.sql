-- Adicionar novos campos para clients
ALTER TABLE public.clients 
ADD COLUMN cpf TEXT,
ADD COLUMN whatsapp TEXT;

-- Adicionar novos campos para pets  
ALTER TABLE public.pets
ADD COLUMN species TEXT,
ADD COLUMN sex TEXT,
ADD COLUMN birth_date DATE;
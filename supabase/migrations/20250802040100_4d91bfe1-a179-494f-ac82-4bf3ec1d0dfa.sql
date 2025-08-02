-- Recriar sistema de clientes do zero
-- Primeiro, drop tabelas existentes se existirem
DROP TABLE IF EXISTS public.pets CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;

-- Criar tabela de clientes (tutores)
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  password TEXT NOT NULL UNIQUE, -- Senha única gerada automaticamente
  
  -- Dados do tutor
  name TEXT NOT NULL,
  cpf TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de pets
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Dados do pet
  name TEXT NOT NULL,
  age TEXT,
  birth_date DATE,
  weight NUMERIC,
  breed TEXT,
  species TEXT,
  sex TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clients
CREATE POLICY "Users can view their own clients" 
ON public.clients FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clients" 
ON public.clients FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" 
ON public.clients FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
ON public.clients FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas RLS para pets
CREATE POLICY "Users can view their own pets" 
ON public.pets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pets" 
ON public.pets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets" 
ON public.pets FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets" 
ON public.pets FOR DELETE 
USING (auth.uid() = user_id);

-- Função para gerar senha única do cliente
CREATE OR REPLACE FUNCTION public.generate_client_password(pet_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  first_letter TEXT;
  random_numbers TEXT;
  new_password TEXT;
  password_exists BOOLEAN;
BEGIN
  -- Pegar primeira letra do nome do pet (maiúscula)
  first_letter := UPPER(LEFT(pet_name, 1));
  
  -- Loop até encontrar uma senha única
  LOOP
    -- Gerar 6 números aleatórios
    random_numbers := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Combinar letra + números
    new_password := first_letter || random_numbers;
    
    -- Verificar se a senha já existe
    SELECT EXISTS(SELECT 1 FROM public.clients WHERE password = new_password) INTO password_exists;
    
    -- Se não existe, sair do loop
    IF NOT password_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_password;
END;
$$;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_password ON public.clients(password);
CREATE INDEX idx_pets_user_id ON public.pets(user_id);
CREATE INDEX idx_pets_client_id ON public.pets(client_id);
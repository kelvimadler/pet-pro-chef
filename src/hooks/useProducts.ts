import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  validity_days: number;
  package_sizes: number[];
  created_at: string;
  updated_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const createProduct = async (productData: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...productData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [data, ...prev]);
      toast({
        title: "Produto criado!",
        description: "Produto adicionado com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro ao criar produto",
        description: "Não foi possível criar o produto.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    products,
    loading,
    createProduct,
    refetch: fetchProducts,
  };
}
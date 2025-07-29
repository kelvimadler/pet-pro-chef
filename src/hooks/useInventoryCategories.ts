import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type InventoryCategory = Database['public']['Tables']['inventory_categories']['Row'];
type InventoryCategoryInsert = Database['public']['Tables']['inventory_categories']['Insert'];
type InventoryCategoryUpdate = Database['public']['Tables']['inventory_categories']['Update'];

export function useInventoryCategories() {
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCategories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Não foi possível carregar as categorias de estoque",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const createCategory = async (categoryData: Omit<InventoryCategoryInsert, 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('inventory_categories')
        .insert([{ ...categoryData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Categoria criada!",
        description: "Nova categoria adicionada com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast({
        title: "Erro ao criar categoria",
        description: "Não foi possível criar a categoria.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCategory = async (id: string, updates: InventoryCategoryUpdate) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('inventory_categories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => prev.map(item => item.id === id ? data : item).sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Categoria atualizada!",
        description: "Categoria atualizada com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast({
        title: "Erro ao atualizar categoria",
        description: "Não foi possível atualizar a categoria.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('inventory_categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setCategories(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Categoria removida!",
        description: "Categoria removida com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      toast({
        title: "Erro ao remover categoria",
        description: "Não foi possível remover a categoria.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
}
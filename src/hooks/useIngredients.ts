import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Ingredient = Database['public']['Tables']['ingredients']['Row'];
type IngredientInsert = Database['public']['Tables']['ingredients']['Insert'];
type IngredientUpdate = Database['public']['Tables']['ingredients']['Update'];

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchIngredients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      toast({
        title: "Erro ao carregar ingredientes",
        description: "Não foi possível carregar a lista de ingredientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [user]);

  const createIngredient = async (ingredientData: Omit<IngredientInsert, 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ingredients')
        .insert([{ ...ingredientData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setIngredients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Ingrediente criado!",
        description: "Ingrediente adicionado com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar ingrediente:', error);
      toast({
        title: "Erro ao criar ingrediente",
        description: "Não foi possível criar o ingrediente.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateIngredient = async (id: string, updates: IngredientUpdate) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ingredients')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setIngredients(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Ingrediente atualizado!",
        description: "Dados do ingrediente atualizados com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar ingrediente:', error);
      toast({
        title: "Erro ao atualizar ingrediente",
        description: "Não foi possível atualizar o ingrediente.",
        variant: "destructive",
      });
      return null;
    }
  };

  const getLowStockIngredients = () => {
    return ingredients.filter(ingredient => 
      ingredient.current_stock <= ingredient.minimum_stock
    );
  };

  return {
    ingredients,
    loading,
    createIngredient,
    updateIngredient,
    getLowStockIngredients,
    refetch: fetchIngredients,
  };
}
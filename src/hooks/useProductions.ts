import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Production = Database['public']['Tables']['productions']['Row'];

export function useProductions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProductions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductions(data || []);
    } catch (error) {
      console.error('Erro ao buscar produções:', error);
      toast({
        title: "Erro ao carregar produções",
        description: "Não foi possível carregar a lista de produções",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, [user]);

  const createProduction = async (productionData: Partial<Production> & { batch_code: string; status: string }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('productions')
        .insert([{ ...productionData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setProductions(prev => [data, ...prev]);
      toast({
        title: "Produção criada!",
        description: "Nova produção adicionada com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar produção:', error);
      toast({
        title: "Erro ao criar produção",
        description: "Não foi possível criar a produção.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProduction = async (id: string, updates: Partial<Production>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('productions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProductions(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Produção atualizada!",
        description: "Dados da produção atualizados com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar produção:', error);
      toast({
        title: "Erro ao atualizar produção",
        description: "Não foi possível atualizar a produção.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteProduction = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('productions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProductions(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Produção excluída!",
        description: "Produção removida com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir produção:', error);
      toast({
        title: "Erro ao excluir produção",
        description: "Não foi possível excluir a produção.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    productions,
    loading,
    createProduction,
    updateProduction,
    deleteProduction,
    refetch: fetchProductions,
  };
}
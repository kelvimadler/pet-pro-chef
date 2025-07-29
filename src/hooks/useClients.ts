import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const createClient = async (clientData: Omit<ClientInsert, 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...clientData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setClients(prev => [data, ...prev]);
      toast({
        title: "Cliente criado!",
        description: "Cliente adicionado com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateClient = async (id: string, updates: ClientUpdate) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setClients(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Cliente atualizado!",
        description: "Dados do cliente atualizados com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setClients(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Cliente removido!",
        description: "Cliente removido com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
}
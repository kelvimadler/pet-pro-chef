import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Pet {
  id: string;
  user_id: string;
  client_id: string;
  name: string;
  breed?: string;
  age?: string;
  weight?: number;
  species?: string;
  sex?: string;
  birth_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function usePets(clientId?: string) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id);
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      toast({
        title: "Erro ao carregar pets",
        description: "Não foi possível carregar a lista de pets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user, clientId]);

  const createPet = async (petData: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([{ ...petData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setPets(prev => [data, ...prev]);
      toast({
        title: "Pet adicionado!",
        description: "Pet cadastrado com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar pet:', error);
      toast({
        title: "Erro ao criar pet",
        description: "Não foi possível cadastrar o pet.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setPets(prev => prev.map(pet => pet.id === id ? data : pet));
      toast({
        title: "Pet atualizado!",
        description: "Dados do pet atualizados com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      toast({
        title: "Erro ao atualizar pet",
        description: "Não foi possível atualizar os dados do pet.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deletePet = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setPets(prev => prev.filter(pet => pet.id !== id));
      toast({
        title: "Pet removido!",
        description: "Pet removido com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
      toast({
        title: "Erro ao deletar pet",
        description: "Não foi possível remover o pet.",
        variant: "destructive",
      });
    }
  };

  return {
    pets,
    loading,
    createPet,
    updatePet,
    deletePet,
    refetch: fetchPets,
  };
}
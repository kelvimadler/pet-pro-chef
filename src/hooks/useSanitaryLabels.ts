import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SanitaryLabel {
  id: string;
  user_id: string;
  product_name: string;
  expiry_datetime: string;
  original_expiry_date: string;
  conservation_type: 'Congelado' | 'Resfriado' | 'Seco';
  observations?: string;
  printed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSanitaryLabelData {
  product_name: string;
  expiry_datetime: string;
  original_expiry_date: string;
  conservation_type: 'Congelado' | 'Resfriado' | 'Seco';
  observations?: string;
}

export function useSanitaryLabels() {
  const [labels, setLabels] = useState<SanitaryLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLabels = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sanitary_labels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLabels((data || []) as SanitaryLabel[]);
    } catch (error) {
      console.error('Erro ao buscar etiquetas sanitárias:', error);
      toast({
        title: "Erro ao carregar etiquetas",
        description: "Não foi possível carregar a lista de etiquetas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createLabel = async (labelData: CreateSanitaryLabelData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sanitary_labels')
        .insert({
          ...labelData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setLabels(prev => [data as SanitaryLabel, ...prev]);
      
      toast({
        title: "Etiqueta criada!",
        description: "A etiqueta foi criada com sucesso.",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar etiqueta:', error);
      toast({
        title: "Erro ao criar etiqueta",
        description: "Não foi possível criar a etiqueta.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const printLabel = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('sanitary_labels')
        .update({ printed: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setLabels(prev => prev.map(label => 
        label.id === id ? { ...label, printed: true } : label
      ));
      
      toast({
        title: "Etiqueta impressa!",
        description: "A etiqueta foi marcada como impressa.",
      });
    } catch (error) {
      console.error('Erro ao marcar etiqueta como impressa:', error);
      toast({
        title: "Erro ao imprimir",
        description: "Não foi possível marcar a etiqueta como impressa.",
        variant: "destructive",
      });
    }
  };

  const deleteLabel = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('sanitary_labels')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setLabels(prev => prev.filter(label => label.id !== id));
      
      toast({
        title: "Etiqueta excluída!",
        description: "A etiqueta foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir etiqueta:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a etiqueta.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLabels();
  }, [user]);

  const getExpiringLabels = () => {
    const now = new Date();
    return labels.filter(label => {
      const expiryDate = new Date(label.expiry_datetime);
      const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
    });
  };

  const getExpiredLabels = () => {
    const now = new Date();
    return labels.filter(label => {
      const expiryDate = new Date(label.expiry_datetime);
      return expiryDate <= now;
    });
  };

  return {
    labels,
    loading,
    createLabel,
    printLabel,
    deleteLabel,
    getExpiringLabels,
    getExpiredLabels,
    refetch: fetchLabels,
  };
}
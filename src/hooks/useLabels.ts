import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Label {
  id: string;
  user_id: string;
  production_id?: string;
  product_name: string;
  batch_code: string;
  production_date: string;
  expiry_date: string;
  package_size: number;
  printed?: boolean;
  status?: string;
  created_at: string;
}

export function useLabels() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLabels = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Calculate status based on expiry date
      const labelsWithStatus = (data || []).map(label => {
        const today = new Date();
        const expiry = new Date(label.expiry_date);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let status = 'valid';
        if (daysUntilExpiry < 0) {
          status = 'expired';
        } else if (daysUntilExpiry <= 2) {
          status = 'expiring';
        }
        
        return { ...label, status };
      });
      
      setLabels(labelsWithStatus);
    } catch (error) {
      console.error('Erro ao buscar etiquetas:', error);
      toast({
        title: "Erro ao carregar etiquetas",
        description: "Não foi possível carregar a lista de etiquetas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, [user]);

  const getExpiringLabels = () => {
    return labels.filter(label => label.status === 'expiring' || label.status === 'expired');
  };

  const printLabel = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('labels')
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

  return {
    labels,
    loading,
    getExpiringLabels,
    printLabel,
    refetch: fetchLabels,
  };
}
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  company_name: string;
  company_cnpj: string;
  company_address: string;
  company_phone: string;
  snacks_validity: number;
  biscuits_validity: number;
  premium_validity: number;
  expiry_alerts: boolean;
  stock_alerts: boolean;
  production_alerts: boolean;
  expiry_days: number;
  stock_percentage: number;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    company_name: 'PetFactory - Alimentação Natural',
    company_cnpj: '00.000.000/0000-00',
    company_address: 'Rua da Fábrica, 123 - São Paulo/SP',
    company_phone: '(11) 99999-0000',
    snacks_validity: 60,
    biscuits_validity: 90,
    premium_validity: 45,
    expiry_alerts: true,
    stock_alerts: true,
    production_alerts: true,
    expiry_days: 3,
    stock_percentage: 30
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        // Merge with defaults
        setSettings(prev => ({
          ...prev,
          company_name: data.company_name || prev.company_name,
          company_phone: data.phone || prev.company_phone,
          // Add other fields as they're added to the profiles table
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const saveSettings = async (newSettings: Partial<Settings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: newSettings.company_name,
          phone: newSettings.company_phone,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setSettings(prev => ({ ...prev, ...newSettings }));
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    loading,
    saveSettings,
    refetch: fetchSettings,
  };
}
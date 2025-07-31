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
  woocommerce_url: string;
  woocommerce_consumer_key: string;
  woocommerce_consumer_secret: string;
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
    stock_percentage: 30,
    woocommerce_url: '',
    woocommerce_consumer_key: '',
    woocommerce_consumer_secret: ''
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
        // Merge with database data
        setSettings(prev => ({
          ...prev,
          company_name: data.company_name || prev.company_name,
          company_cnpj: data.company_cnpj || prev.company_cnpj,
          company_address: data.company_address || prev.company_address,
          company_phone: data.phone || prev.company_phone,
          snacks_validity: data.snacks_validity || prev.snacks_validity,
          biscuits_validity: data.biscuits_validity || prev.biscuits_validity,
          premium_validity: data.premium_validity || prev.premium_validity,
          expiry_alerts: data.expiry_alerts !== null ? data.expiry_alerts : prev.expiry_alerts,
          stock_alerts: data.stock_alerts !== null ? data.stock_alerts : prev.stock_alerts,
          production_alerts: data.production_alerts !== null ? data.production_alerts : prev.production_alerts,
          expiry_days: data.expiry_days || prev.expiry_days,
          stock_percentage: data.stock_percentage || prev.stock_percentage,
          woocommerce_url: data.woocommerce_url || prev.woocommerce_url,
          woocommerce_consumer_key: data.woocommerce_consumer_key || prev.woocommerce_consumer_key,
          woocommerce_consumer_secret: data.woocommerce_consumer_secret || prev.woocommerce_consumer_secret,
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
          company_cnpj: newSettings.company_cnpj,
          company_address: newSettings.company_address,
          phone: newSettings.company_phone,
          snacks_validity: newSettings.snacks_validity,
          biscuits_validity: newSettings.biscuits_validity,
          premium_validity: newSettings.premium_validity,
          expiry_alerts: newSettings.expiry_alerts,
          stock_alerts: newSettings.stock_alerts,
          production_alerts: newSettings.production_alerts,
          expiry_days: newSettings.expiry_days,
          stock_percentage: newSettings.stock_percentage,
          woocommerce_url: newSettings.woocommerce_url,
          woocommerce_consumer_key: newSettings.woocommerce_consumer_key,
          woocommerce_consumer_secret: newSettings.woocommerce_consumer_secret,
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
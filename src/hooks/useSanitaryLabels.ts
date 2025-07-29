import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

  const printLabel = (labelData: SanitaryLabel) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Etiqueta Sanitária - ${labelData.product_name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
              .label { 
                width: 60mm; 
                background: white; 
                border: 1px solid #000; 
                padding: 8px; 
                text-align: center;
                font-size: 10px;
              }
              .product-name { font-weight: bold; font-size: 12px; margin-bottom: 4px; }
              .conservation { font-size: 11px; margin-bottom: 4px; }
              .dates { margin-bottom: 4px; }
              .qr-placeholder { 
                width: 20mm; 
                height: 20mm; 
                border: 1px solid #ccc; 
                margin: 4px auto; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                font-size: 8px;
              }
              .observations { font-size: 9px; background: #f5f5f5; padding: 2px; margin-top: 4px; }
            }
            body { font-family: Arial, sans-serif; }
            .label { 
              width: 60mm; 
              background: white; 
              border: 2px solid #000; 
              padding: 10px; 
              text-align: center;
              margin: 20px auto;
            }
            .product-name { font-weight: bold; font-size: 14px; margin-bottom: 6px; }
            .conservation { font-size: 12px; margin-bottom: 6px; }
            .dates { margin-bottom: 6px; font-size: 10px; }
            .qr-placeholder { 
              width: 25mm; 
              height: 25mm; 
              border: 1px solid #ccc; 
              margin: 6px auto; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              background: #f9f9f9;
            }
            .observations { font-size: 10px; background: #f5f5f5; padding: 4px; margin-top: 6px; border-radius: 2px; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="product-name">${labelData.product_name}</div>
            <div class="conservation">${getConservationIcon(labelData.conservation_type)} ${labelData.conservation_type}</div>
            <div class="dates">
              <div>Validade: ${format(new Date(labelData.expiry_datetime), "dd/MM/yyyy HH:mm")}</div>
              <div>Original: ${format(new Date(labelData.original_expiry_date), "dd/MM/yyyy")}</div>
            </div>
            <div class="qr-placeholder">QR Code</div>
            ${labelData.observations ? `<div class="observations">${labelData.observations}</div>` : ''}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const getConservationIcon = (type: string) => {
    switch (type) {
      case 'Congelado': return '❄️';
      case 'Resfriado': return '🧊';
      case 'Seco': return '📦';
      default: return '📦';
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
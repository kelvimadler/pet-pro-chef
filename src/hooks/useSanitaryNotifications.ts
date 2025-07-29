import { useEffect } from 'react';
import { useSanitaryLabels } from './useSanitaryLabels';
import { useNotifications } from './useNotifications';

export function useSanitaryNotifications() {
  const { getExpiringLabels, getExpiredLabels } = useSanitaryLabels();
  const { createNotification } = useNotifications();

  useEffect(() => {
    const checkSanitaryLabels = async () => {
      const expiringLabels = getExpiringLabels();
      const expiredLabels = getExpiredLabels();

      // Notificar sobre etiquetas expirando (próximas 24h)
      for (const label of expiringLabels) {
        const expiryDate = new Date(label.expiry_datetime);
        const hoursUntilExpiry = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60));
        
        await createNotification({
          title: `Etiqueta Sanitária Vencendo`,
          message: `${label.product_name} vence em ${hoursUntilExpiry}h`,
          type: 'sanitary_expiry',
          related_id: label.id,
        });
      }

      // Notificar sobre etiquetas vencidas
      for (const label of expiredLabels) {
        await createNotification({
          title: `Etiqueta Sanitária Vencida`,
          message: `${label.product_name} venceu em ${new Date(label.expiry_datetime).toLocaleDateString('pt-BR')}`,
          type: 'sanitary_expiry',
          related_id: label.id,
        });
      }
    };

    // Verificar a cada 30 minutos
    const interval = setInterval(checkSanitaryLabels, 30 * 60 * 1000);
    
    // Verificar imediatamente
    checkSanitaryLabels();

    return () => clearInterval(interval);
  }, [getExpiringLabels, getExpiredLabels, createNotification]);
}
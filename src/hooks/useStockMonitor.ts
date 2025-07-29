import { useEffect, useRef } from 'react';
import { useIngredients } from './useIngredients';
import { useNotifications } from './useNotifications';

export function useStockMonitor() {
  const { getLowStockIngredients } = useIngredients();
  const { createNotification, notifications } = useNotifications();
  const lastCheckRef = useRef<string[]>([]);

  useEffect(() => {
    const checkStockLevels = () => {
      const lowStockIngredients = getLowStockIngredients();
      const currentLowStockIds = lowStockIngredients.map(ing => ing.id);
      
      // Only create notifications for new low stock items
      const newLowStockItems = lowStockIngredients.filter(ingredient => {
        const alreadyNotified = lastCheckRef.current.includes(ingredient.id);
        const hasRecentNotification = notifications.some(notif => 
          notif.type === 'stock' && 
          notif.related_id === ingredient.id &&
          !notif.is_read &&
          new Date(notif.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
        );
        
        return !alreadyNotified && !hasRecentNotification;
      });
      
      newLowStockItems.forEach(ingredient => {
        createNotification({
          title: 'Estoque Baixo',
          message: `${ingredient.name} está com estoque baixo (${ingredient.current_stock} ${ingredient.unit})`,
          type: 'stock',
          related_id: ingredient.id
        });
      });
      
      lastCheckRef.current = currentLowStockIds;
    };

    // Initial check after delay to ensure ingredients are loaded
    const initialTimeout = setTimeout(checkStockLevels, 2000);
    
    // Then check every hour
    const interval = setInterval(checkStockLevels, 3600000); // 1 hour

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [getLowStockIngredients, createNotification, notifications]);

  return null;
}
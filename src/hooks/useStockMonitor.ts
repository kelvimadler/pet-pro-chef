import { useEffect } from 'react';
import { useIngredients } from './useIngredients';
import { useNotifications } from './useNotifications';

export function useStockMonitor() {
  const { getLowStockIngredients } = useIngredients();
  const { createNotification } = useNotifications();

  useEffect(() => {
    const checkStockLevels = () => {
      const lowStockIngredients = getLowStockIngredients();
      
      lowStockIngredients.forEach(ingredient => {
        createNotification({
          title: 'Estoque Baixo',
          message: `${ingredient.name} está com estoque baixo (${ingredient.current_stock} ${ingredient.unit})`,
          type: 'stock',
          related_id: ingredient.id
        });
      });
    };

    // Check stock levels on mount and then every hour
    checkStockLevels();
    const interval = setInterval(checkStockLevels, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, [getLowStockIngredients, createNotification]);

  return null;
}
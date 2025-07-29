import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];
type InventoryItemInsert = Database['public']['Tables']['inventory_items']['Insert'];
type InventoryItemUpdate = Database['public']['Tables']['inventory_items']['Update'];

export function useInventoryItems(categoryId?: string) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query.order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      toast({
        title: "Erro ao carregar itens",
        description: "Não foi possível carregar os itens de estoque",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user, categoryId]);

  const createItem = async (itemData: Omit<InventoryItemInsert, 'user_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{ ...itemData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "Item criado!",
        description: "Item adicionado ao estoque com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar item:', error);
      toast({
        title: "Erro ao criar item",
        description: "Não foi possível criar o item.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateItem = async (id: string, updates: InventoryItemUpdate) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Item atualizado!",
        description: "Item atualizado com sucesso.",
      });
      return data;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast({
        title: "Erro ao atualizar item",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Item removido!",
        description: "Item removido do estoque com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: "Erro ao remover item",
        description: "Não foi possível remover o item.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateStock = async (id: string, quantity: number, type: 'add' | 'subtract') => {
    if (!user) return false;

    try {
      // Get current stock
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory_items')
        .select('current_stock')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const newStock = type === 'add' 
        ? Number(currentItem.current_stock) + quantity 
        : Number(currentItem.current_stock) - quantity;

      if (newStock < 0) {
        toast({
          title: "Estoque insuficiente",
          description: "Não é possível reduzir o estoque abaixo de zero.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('inventory_items')
        .update({ current_stock: newStock })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => prev.map(item => item.id === id ? data : item));
      
      // Create movement record
      await supabase
        .from('inventory_movements')
        .insert([{
          user_id: user.id,
          ingredient_id: id,
          movement_type: type === 'add' ? 'in' : 'out',
          quantity: quantity,
          notes: type === 'add' ? 'Entrada manual de estoque' : 'Saída manual de estoque'
        }]);

      toast({
        title: "Estoque atualizado!",
        description: `Estoque ${type === 'add' ? 'aumentado' : 'reduzido'} com sucesso.`,
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      toast({
        title: "Erro ao atualizar estoque",
        description: "Não foi possível atualizar o estoque.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getLowStockItems = () => {
    return items.filter(item => 
      Number(item.current_stock) <= Number(item.minimum_stock) && Number(item.minimum_stock) > 0
    );
  };

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    updateStock,
    getLowStockItems,
    refetch: fetchItems,
  };
}
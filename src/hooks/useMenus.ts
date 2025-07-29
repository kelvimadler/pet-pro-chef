import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type Menu = {
  id: string;
  user_id: string;
  name: string;
  client_id: string;
  daily_food_amount: number;
  meals_per_day: number;
  ingredients: any;
  special_notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type MenuInsert = Omit<Menu, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
type MenuUpdate = Partial<MenuInsert>;

export function useMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMenus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMenus(data || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cardápios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [user]);

  const createMenu = async (menuData: MenuInsert) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('menus')
        .insert([{
          ...menuData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setMenus(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Cardápio criado com sucesso!",
      });
      return data;
    } catch (error) {
      console.error('Error creating menu:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o cardápio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMenu = async (id: string, updates: MenuUpdate) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('menus')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setMenus(prev => prev.map(menu => menu.id === id ? data : menu));
      toast({
        title: "Sucesso",
        description: "Cardápio atualizado com sucesso!",
      });
      return data;
    } catch (error) {
      console.error('Error updating menu:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cardápio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMenu = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMenus(prev => prev.filter(menu => menu.id !== id));
      toast({
        title: "Sucesso",
        description: "Cardápio removido com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o cardápio",
        variant: "destructive",
      });
      throw error;
    }
  };

  const printMenu = (menu: Menu) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cardápio - ${menu.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { max-width: 800px; margin: 0 auto; }
            .section { margin-bottom: 20px; }
            .ingredient { padding: 5px; border-bottom: 1px solid #eee; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="content">
            <div class="header">
              <h1>Cardápio Personalizado</h1>
              <h2>${menu.name}</h2>
            </div>
            
            <div class="section">
              <h3>Informações Gerais</h3>
              <p><strong>Quantidade Diária:</strong> ${menu.daily_food_amount}g</p>
              <p><strong>Refeições por Dia:</strong> ${menu.meals_per_day}</p>
              <p><strong>Criado em:</strong> ${new Date(menu.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div class="section">
              <h3>Ingredientes</h3>
              <table>
                <thead>
                  <tr>
                    <th>Ingrediente</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                  </tr>
                </thead>
                <tbody>
                  ${menu.ingredients.map(ing => `
                    <tr>
                      <td>${ing.name}</td>
                      <td>${ing.quantity}</td>
                      <td>${ing.unit}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            ${menu.special_notes ? `
              <div class="section">
                <h3>Observações Especiais</h3>
                <p>${menu.special_notes}</p>
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return {
    menus,
    loading,
    createMenu,
    updateMenu,
    deleteMenu,
    printMenu,
    refetch: fetchMenus,
  };
}
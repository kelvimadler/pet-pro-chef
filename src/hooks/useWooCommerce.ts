import { useSettings } from './useSettings';
import { useToast } from './use-toast';

interface WooCommerceProduct {
  id: number;
  sku: string;
  stock_quantity: number;
  manage_stock: boolean;
}

export function useWooCommerce() {
  const { settings } = useSettings();
  const { toast } = useToast();

  const getHeaders = () => {
    if (!settings.woocommerce_consumer_key || !settings.woocommerce_consumer_secret) {
      throw new Error('WooCommerce API credentials not configured');
    }

    const auth = btoa(`${settings.woocommerce_consumer_key}:${settings.woocommerce_consumer_secret}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  };

  const syncStockToWooCommerce = async (sku: string, stockQuantity: number) => {
    try {
      if (!settings.woocommerce_url) {
        throw new Error('WooCommerce URL not configured');
      }

      const headers = getHeaders();
      
      // First, find the product by SKU
      const searchUrl = `${settings.woocommerce_url}/wp-json/wc/v3/products?sku=${sku}`;
      const searchResponse = await fetch(searchUrl, { headers });
      
      if (!searchResponse.ok) {
        throw new Error(`Failed to search product: ${searchResponse.statusText}`);
      }

      const products = await searchResponse.json();
      
      if (products.length === 0) {
        throw new Error(`Product with SKU ${sku} not found in WooCommerce`);
      }

      const product = products[0];

      // Update the stock
      const updateUrl = `${settings.woocommerce_url}/wp-json/wc/v3/products/${product.id}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          stock_quantity: stockQuantity,
          manage_stock: true,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update stock: ${updateResponse.statusText}`);
      }

      toast({
        title: "Estoque sincronizado",
        description: `Estoque do produto ${sku} atualizado no WooCommerce.`,
      });

      return await updateResponse.json();
    } catch (error) {
      console.error('Error syncing stock to WooCommerce:', error);
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Falha ao sincronizar estoque com WooCommerce",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getStockFromWooCommerce = async (sku: string): Promise<number> => {
    try {
      if (!settings.woocommerce_url) {
        throw new Error('WooCommerce URL not configured');
      }

      const headers = getHeaders();
      
      const searchUrl = `${settings.woocommerce_url}/wp-json/wc/v3/products?sku=${sku}`;
      const response = await fetch(searchUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`Failed to get product: ${response.statusText}`);
      }

      const products = await response.json();
      
      if (products.length === 0) {
        throw new Error(`Product with SKU ${sku} not found in WooCommerce`);
      }

      return products[0].stock_quantity || 0;
    } catch (error) {
      console.error('Error getting stock from WooCommerce:', error);
      toast({
        title: "Erro ao buscar estoque",
        description: error instanceof Error ? error.message : "Falha ao buscar estoque do WooCommerce",
        variant: "destructive",
      });
      throw error;
    }
  };

  const testConnection = async (): Promise<boolean> => {
    try {
      if (!settings.woocommerce_url) {
        throw new Error('WooCommerce URL not configured');
      }

      const headers = getHeaders();
      
      const testUrl = `${settings.woocommerce_url}/wp-json/wc/v3/products?per_page=1`;
      const response = await fetch(testUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`Connection failed: ${response.statusText}`);
      }

      toast({
        title: "Conexão bem-sucedida",
        description: "Conectado ao WooCommerce com sucesso!",
      });

      return true;
    } catch (error) {
      console.error('Error testing WooCommerce connection:', error);
      toast({
        title: "Erro de conexão",
        description: error instanceof Error ? error.message : "Falha ao conectar com WooCommerce",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    syncStockToWooCommerce,
    getStockFromWooCommerce,
    testConnection,
    isConfigured: !!(settings.woocommerce_url && settings.woocommerce_consumer_key && settings.woocommerce_consumer_secret),
  };
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/useSettings";
import { 
  Settings as SettingsIcon, 
  Building, 
  Bell, 
  Package,
  Save,
  ShoppingCart,
  TestTube
} from "lucide-react";
import { MaskedInput } from "@/components/ui/masked-input";
import { useWooCommerce } from "@/hooks/useWooCommerce";

export default function Settings() {
  const { settings, saveSettings } = useSettings();
  const { testConnection } = useWooCommerce();
  const [formData, setFormData] = useState(settings);

  // Update formData when settings change
  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = async () => {
    await saveSettings(formData);
  };

  const handleTestConnection = async () => {
    await testConnection();
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Parâmetros do sistema e dados da empresa
          </p>
        </div>
        <Button 
          onClick={handleSave}
          className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Company Info */}
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Dados da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input 
                  id="company-name" 
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-cnpj">CNPJ</Label>
                <Input 
                  id="company-cnpj" 
                  value={formData.company_cnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_cnpj: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Endereço</Label>
                <Input 
                  id="company-address" 
                  value={formData.company_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone">Telefone</Label>
                <Input 
                  id="company-phone" 
                  value={formData.company_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_phone: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Settings */}
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Parâmetros de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="snacks-validity">Validade Snacks (dias)</Label>
                <Input 
                  id="snacks-validity" 
                  type="number" 
                  value={formData.snacks_validity}
                  onChange={(e) => setFormData(prev => ({ ...prev, snacks_validity: parseInt(e.target.value) || 60 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biscuits-validity">Validade Biscoitos (dias)</Label>
                <Input 
                  id="biscuits-validity" 
                  type="number" 
                  value={formData.biscuits_validity}
                  onChange={(e) => setFormData(prev => ({ ...prev, biscuits_validity: parseInt(e.target.value) || 90 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premium-validity">Validade Premium (dias)</Label>
                <Input 
                  id="premium-validity" 
                  type="number" 
                  value={formData.premium_validity}
                  onChange={(e) => setFormData(prev => ({ ...prev, premium_validity: parseInt(e.target.value) || 45 }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WooCommerce API Settings */}
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Integração WooCommerce
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="woocommerce-url">URL da Loja</Label>
                <Input 
                  id="woocommerce-url" 
                  placeholder="https://minhaloja.com.br"
                  value={formData.woocommerce_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, woocommerce_url: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consumer-key">Consumer Key (CK)</Label>
                  <MaskedInput 
                    id="consumer-key" 
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    masked={!!formData.woocommerce_consumer_key}
                    value={formData.woocommerce_consumer_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, woocommerce_consumer_key: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumer-secret">Consumer Secret (CS)</Label>
                  <MaskedInput 
                    id="consumer-secret" 
                    placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    masked={!!formData.woocommerce_consumer_secret}
                    value={formData.woocommerce_consumer_secret}
                    onChange={(e) => setFormData(prev => ({ ...prev, woocommerce_consumer_secret: e.target.value }))}
                  />
                </div>
              </div>
              <Button 
                onClick={handleTestConnection}
                variant="outline" 
                className="w-full"
                disabled={!formData.woocommerce_url || !formData.woocommerce_consumer_key || !formData.woocommerce_consumer_secret}
              >
                <TestTube className="w-4 h-4 mr-2" />
                Testar Conexão
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Settings */}
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Configurações de Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="expiry-alerts">Alertas de Vencimento</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar quando produtos estão próximos ao vencimento
                  </p>
                </div>
                <Switch 
                  id="expiry-alerts" 
                  checked={formData.expiry_alerts}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, expiry_alerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stock-alerts">Alertas de Estoque</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar quando ingredientes estão em baixa
                  </p>
                </div>
                <Switch 
                  id="stock-alerts" 
                  checked={formData.stock_alerts}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stock_alerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="production-alerts">Alertas de Produção</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar sobre etapas de produção pendentes
                  </p>
                </div>
                <Switch 
                  id="production-alerts" 
                  checked={formData.production_alerts}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, production_alerts: checked }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <Label htmlFor="expiry-days">Alertar X dias antes do vencimento</Label>
                <Input 
                  id="expiry-days" 
                  type="number" 
                  value={formData.expiry_days}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiry_days: parseInt(e.target.value) || 3 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-percentage">Alertar quando estoque menor que X%</Label>
                <Input 
                  id="stock-percentage" 
                  type="number" 
                  value={formData.stock_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock_percentage: parseInt(e.target.value) || 30 }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
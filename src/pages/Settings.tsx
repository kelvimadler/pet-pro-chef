import { useState } from "react";
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
  Save
} from "lucide-react";

export default function Settings() {
  const { settings, saveSettings } = useSettings();
  const [formData, setFormData] = useState(settings);

  const handleSave = async () => {
    await saveSettings(formData);
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
                <Input id="company-cnpj" defaultValue="00.000.000/0000-00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Endereço</Label>
                <Input id="company-address" defaultValue="Rua da Fábrica, 123 - São Paulo/SP" />
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
                <Input id="snacks-validity" type="number" defaultValue="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biscuits-validity">Validade Biscoitos (dias)</Label>
                <Input id="biscuits-validity" type="number" defaultValue="90" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premium-validity">Validade Premium (dias)</Label>
                <Input id="premium-validity" type="number" defaultValue="45" />
              </div>
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
                <Switch id="expiry-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stock-alerts">Alertas de Estoque</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar quando ingredientes estão em baixa
                  </p>
                </div>
                <Switch id="stock-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="production-alerts">Alertas de Produção</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar sobre etapas de produção pendentes
                  </p>
                </div>
                <Switch id="production-alerts" defaultChecked />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <Label htmlFor="expiry-days">Alertar X dias antes do vencimento</Label>
                <Input id="expiry-days" type="number" defaultValue="3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-percentage">Alertar quando estoque menor que X%</Label>
                <Input id="stock-percentage" type="number" defaultValue="30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
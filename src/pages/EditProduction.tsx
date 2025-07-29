import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useProductions } from "@/hooks/useProductions";
import { useProducts } from "@/hooks/useProducts";
import { ArrowLeft, ChefHat, Snowflake, Factory, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditProduction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productions, updateProduction } = useProductions();
  const { products } = useProducts();
  const { toast } = useToast();
  const [production, setProduction] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const foundProduction = productions.find(p => p.id === id);
    if (foundProduction) {
      setProduction(foundProduction);
      setFormData(foundProduction);
    }
  }, [id, productions]);

  if (!production) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Produção não encontrada</h2>
          <Button onClick={() => navigate('/productions')} className="mt-4">
            Voltar para Produções
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "finished":
        return "bg-green-100 text-green-800 border-green-200";
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "Em Produção";
      case "finished":
        return "Finalizada";
      case "open":
        return "Aberta";
      default:
        return status;
    }
  };

  const handleUpdate = async (updates: any) => {
    const result = await updateProduction(production.id, updates);
    if (result) {
      setFormData(prev => ({ ...prev, ...updates }));
      setProduction(prev => ({ ...prev, ...updates }));
    }
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '';
    return new Date(dateTime).toISOString().slice(0, 16);
  };

  const parseDateTime = (dateTime: string) => {
    if (!dateTime) return null;
    return new Date(dateTime).toISOString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/productions')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Editar Produção</h1>
          <p className="text-muted-foreground mt-1">
            Lote: {production.batch_code}
          </p>
        </div>
        <Badge variant="outline" className={getStatusColor(production.status)}>
          {getStatusLabel(production.status)}
        </Badge>
      </div>

      {/* Dados Básicos */}
      <Card className="shadow-card-hover border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            Dados Básicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch-code">Código do Lote</Label>
              <Input
                id="batch-code"
                value={formData.batch_code || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, batch_code: e.target.value }))}
                onBlur={() => handleUpdate({ batch_code: formData.batch_code })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Produto</Label>
              <Select 
                value={formData.product_id || ''} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, product_id: value }));
                  handleUpdate({ product_id: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein-type">Tipo de Proteína</Label>
              <Input
                id="protein-type"
                value={formData.protein_type || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, protein_type: e.target.value }))}
                onBlur={() => handleUpdate({ protein_type: formData.protein_type })}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Preparação Inicial</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="initial-cleaning">Limpeza Inicial</Label>
                <Switch
                  id="initial-cleaning"
                  checked={formData.initial_cleaning || false}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ ...prev, initial_cleaning: checked }));
                    handleUpdate({ initial_cleaning: checked });
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="epi-used">EPI Utilizado</Label>
                <Switch
                  id="epi-used"
                  checked={formData.epi_used || false}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ ...prev, epi_used: checked }));
                    handleUpdate({ epi_used: checked });
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Etapa 1: Descongelamento */}
      <Card className="shadow-card-hover border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-blue-500" />
            Etapa 1: Descongelamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frozen-weight">Peso Congelado (kg)</Label>
              <Input
                id="frozen-weight"
                type="number"
                step="0.01"
                value={formData.frozen_weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, frozen_weight: e.target.value }))}
                onBlur={() => handleUpdate({ frozen_weight: parseFloat(formData.frozen_weight) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thawed-weight">Peso Descongelado (kg)</Label>
              <Input
                id="thawed-weight"
                type="number"
                step="0.01"
                value={formData.thawed_weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, thawed_weight: e.target.value }))}
                onBlur={() => handleUpdate({ thawed_weight: parseFloat(formData.thawed_weight) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thaw-time">Hora de Descongelamento</Label>
              <Input
                id="thaw-time"
                type="datetime-local"
                value={formatDateTime(formData.thaw_time)}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, thaw_time: e.target.value }));
                  handleUpdate({ thaw_time: parseDateTime(e.target.value) });
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Etapa 2: Produção e Pesagens */}
      <Card className="shadow-card-hover border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-orange-500" />
            Etapa 2: Produção e Pesagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dehydrator-entry">Data/hora entrada desidratadora</Label>
              <Input
                id="dehydrator-entry"
                type="datetime-local"
                value={formatDateTime(formData.dehydrator_entry_time)}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, dehydrator_entry_time: e.target.value }));
                  handleUpdate({ dehydrator_entry_time: parseDateTime(e.target.value) });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ambient-temp">Temperatura ambiente (°C)</Label>
              <Input
                id="ambient-temp"
                type="number"
                step="0.1"
                value={formData.ambient_temperature || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ambient_temperature: e.target.value }))}
                onBlur={() => handleUpdate({ ambient_temperature: parseFloat(formData.ambient_temperature) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dehydrator-temp">Temperatura desidratadora (°C)</Label>
              <Input
                id="dehydrator-temp"
                type="number"
                step="0.1"
                value={formData.dehydrator_temperature || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, dehydrator_temperature: e.target.value }))}
                onBlur={() => handleUpdate({ dehydrator_temperature: parseFloat(formData.dehydrator_temperature) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tray-count">Número de bandejas</Label>
              <Input
                id="tray-count"
                type="number"
                value={formData.tray_count || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, tray_count: e.target.value }))}
                onBlur={() => handleUpdate({ tray_count: parseInt(formData.tray_count) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clean-weight">Peso limpo (kg)</Label>
              <Input
                id="clean-weight"
                type="number"
                step="0.01"
                value={formData.clean_weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, clean_weight: e.target.value }))}
                onBlur={() => handleUpdate({ clean_weight: parseFloat(formData.clean_weight) || null })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="final-weight">Peso final desidratado (kg)</Label>
              <Input
                id="final-weight"
                type="number"
                step="0.01"
                value={formData.final_weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, final_weight: e.target.value }))}
                onBlur={() => handleUpdate({ final_weight: parseFloat(formData.final_weight) || null })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Etapa 3: Análise e Finalização */}
      <Card className="shadow-card-hover border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Etapa 3: Análise e Finalização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visual-analysis">Análise Visual</Label>
              <Select 
                value={formData.visual_analysis?.toString() || ''} 
                onValueChange={(value) => {
                  const boolValue = value === 'true';
                  setFormData(prev => ({ ...prev, visual_analysis: boolValue }));
                  handleUpdate({ visual_analysis: boolValue });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Aprovado</SelectItem>
                  <SelectItem value="false">Reprovado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="final-cleaning">Limpeza Final</Label>
              <Select 
                value={formData.final_cleaning?.toString() || ''} 
                onValueChange={(value) => {
                  const boolValue = value === 'true';
                  setFormData(prev => ({ ...prev, final_cleaning: boolValue }));
                  handleUpdate({ final_cleaning: boolValue });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dehydrator-exit">Data/hora retirada desidratadora</Label>
              <Input
                id="dehydrator-exit"
                type="datetime-local"
                value={formatDateTime(formData.dehydrator_exit_time)}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, dehydrator_exit_time: e.target.value }));
                  handleUpdate({ dehydrator_exit_time: parseDateTime(e.target.value) });
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão para voltar */}
      <div className="flex gap-4">
        <Button onClick={() => navigate('/productions')}>
          Voltar para Produções
        </Button>
      </div>
    </div>
  );
}
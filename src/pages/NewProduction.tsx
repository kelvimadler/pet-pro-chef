import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useProductions } from "@/hooks/useProductions";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, ArrowLeft } from "lucide-react";

export default function NewProduction() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { createProduction, productions } = useProductions();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    batch_code: '',
    product_id: '',
    protein_type: '',
    initial_cleaning: false,
    epi_used: false,
  });

  const generateBatchCode = () => {
    // Encontrar o maior número de lote existente
    const existingBatchNumbers = productions
      .map(p => {
        const match = p.batch_code.match(/^(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num >= 8000);
    
    const maxBatch = existingBatchNumbers.length > 0 ? Math.max(...existingBatchNumbers) : 7999;
    return (maxBatch + 1).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const batch_code = formData.batch_code || generateBatchCode();
    
    // Verificar se o lote já existe
    const existingProduction = productions.find(p => p.batch_code === batch_code);
    if (existingProduction) {
      toast({
        title: "Código de lote já existe",
        description: "Este número de lote já está em uso. Escolha outro.",
        variant: "destructive",
      });
      return;
    }
    
    const production = await createProduction({
      batch_code,
      product_id: formData.product_id || null,
      protein_type: formData.protein_type,
      initial_cleaning: formData.initial_cleaning,
      epi_used: formData.epi_used,
      status: 'open',
      production_date: new Date().toISOString().split('T')[0],
    });

    if (production) {
      navigate('/productions');
    }
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nova Produção</h1>
          <p className="text-muted-foreground mt-1">
            Criar uma nova produção de petiscos
          </p>
        </div>
      </div>

      <Card className="shadow-card-hover border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-code">Código do Lote</Label>
                <Input
                  id="batch-code"
                  placeholder="Deixe vazio para gerar automaticamente"
                  value={formData.batch_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, batch_code: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Produto (opcional)</Label>
                <Select 
                  value={formData.product_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein-type">Tipo de Proteína</Label>
              <Input
                id="protein-type"
                placeholder="Ex: Frango, Salmão, Carne bovina..."
                value={formData.protein_type}
                onChange={(e) => setFormData(prev => ({ ...prev, protein_type: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preparação Inicial</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="initial-cleaning">Limpeza Inicial</Label>
                  <p className="text-sm text-muted-foreground">
                    Limpeza e sanitização do ambiente realizada
                  </p>
                </div>
                <Switch
                  id="initial-cleaning"
                  checked={formData.initial_cleaning}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, initial_cleaning: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="epi-used">EPI Utilizado</Label>
                  <p className="text-sm text-muted-foreground">
                    Equipamentos de proteção individual utilizados
                  </p>
                </div>
                <Switch
                  id="epi-used"
                  checked={formData.epi_used}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, epi_used: checked }))}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/productions')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
              >
                Criar Produção
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useIngredients } from "@/hooks/useIngredients";
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Eye,
  Edit,
  Truck,
  DollarSign
} from "lucide-react";

export default function Inventory() {
  const { ingredients, loading, createIngredient, updateIngredient, getLowStockIngredients } = useIngredients();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: 'kg',
    current_stock: '',
    minimum_stock: '',
    maximum_stock: '',
    cost_per_unit: '',
    supplier: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      unit: 'kg',
      current_stock: '',
      minimum_stock: '',
      maximum_stock: '',
      cost_per_unit: '',
      supplier: ''
    });
    setEditingIngredient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const ingredientData = {
      ...formData,
      current_stock: parseFloat(formData.current_stock) || 0,
      minimum_stock: parseFloat(formData.minimum_stock) || 0,
      maximum_stock: formData.maximum_stock ? parseFloat(formData.maximum_stock) : null,
      cost_per_unit: formData.cost_per_unit ? parseFloat(formData.cost_per_unit) : 0,
    };

    if (editingIngredient) {
      await updateIngredient(editingIngredient.id, ingredientData);
    } else {
      await createIngredient(ingredientData);
    }
    
    setShowDialog(false);
    resetForm();
  };

  const handleEdit = (ingredient: any) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      current_stock: ingredient.current_stock?.toString() || '',
      minimum_stock: ingredient.minimum_stock?.toString() || '',
      maximum_stock: ingredient.maximum_stock?.toString() || '',
      cost_per_unit: ingredient.cost_per_unit?.toString() || '',
      supplier: ingredient.supplier || ''
    });
    setShowDialog(true);
  };

  const getStatusInfo = (ingredient: any) => {
    const currentStock = ingredient.current_stock || 0;
    const minStock = ingredient.minimum_stock || 0;
    const maxStock = ingredient.maximum_stock || 100;
    const percentage = maxStock > 0 ? (currentStock / maxStock) * 100 : 0;
    
    if (currentStock <= minStock * 0.5) {
      return {
        status: "critical",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: TrendingDown,
        iconColor: "text-red-600",
        label: "Crítico"
      };
    } else if (currentStock <= minStock) {
      return {
        status: "low", 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        label: "Baixo"
      };
    } else if (percentage >= 80) {
      return {
        status: "good",
        color: "bg-green-100 text-green-800 border-green-200", 
        icon: TrendingUp,
        iconColor: "text-green-600",
        label: "Bom"
      };
    } else {
      return {
        status: "normal",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Package,
        iconColor: "text-blue-600", 
        label: "Normal"
      };
    }
  };

  const getStockPercentage = (ingredient: any) => {
    const maxStock = ingredient.maximum_stock || 100;
    return maxStock > 0 ? (ingredient.current_stock / maxStock) * 100 : 0;
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ingredient.supplier && ingredient.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const lowStockIngredients = getLowStockIngredients();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Estoque</h1>
          <p className="text-muted-foreground mt-1">
            Controle inteligente de ingredientes
          </p>
          {lowStockIngredients.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm text-warning font-medium">
                {lowStockIngredients.length} ingrediente(s) com estoque baixo
              </span>
            </div>
          )}
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Ingrediente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingIngredient ? "Editar Ingrediente" : "Novo Ingrediente"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Ingrediente *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade *</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="kg, g, L, ml..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-stock">Estoque Atual *</Label>
                  <Input
                    id="current-stock"
                    type="number"
                    step="0.01"
                    value={formData.current_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_stock: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum-stock">Estoque Mínimo *</Label>
                  <Input
                    id="minimum-stock"
                    type="number"
                    step="0.01"
                    value={formData.minimum_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_stock: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximum-stock">Estoque Máximo</Label>
                  <Input
                    id="maximum-stock"
                    type="number"
                    step="0.01"
                    value={formData.maximum_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, maximum_stock: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost-per-unit">Custo por Unidade (R$)</Label>
                  <Input
                    id="cost-per-unit"
                    type="number"
                    step="0.01"
                    value={formData.cost_per_unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost_per_unit: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
                >
                  {editingIngredient ? "Atualizar" : "Criar"} Ingrediente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar ingredientes ou fornecedores..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-4">
        {filteredIngredients.length === 0 ? (
          <Card className="shadow-card-hover border-border/50">
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? "Nenhum ingrediente encontrado" : "Nenhum ingrediente cadastrado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Nenhum ingrediente corresponde aos critérios de busca." 
                  : "Comece adicionando seus primeiros ingredientes ao estoque."
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => { resetForm(); setShowDialog(true); }}
                  className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Ingrediente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredIngredients.map((ingredient) => {
            const statusInfo = getStatusInfo(ingredient);
            const stockPercentage = getStockPercentage(ingredient);
            const StatusIcon = statusInfo.icon;
            const totalValue = (ingredient.current_stock || 0) * (ingredient.cost_per_unit || 0);

            return (
              <Card key={ingredient.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        {ingredient.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {ingredient.supplier ? `${ingredient.supplier} • ` : ""}Unidade: {ingredient.unit}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${statusInfo.color} flex items-center gap-1`}
                    >
                      <StatusIcon className={`w-3 h-3 ${statusInfo.iconColor}`} />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">Estoque Atual</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-foreground">
                            {ingredient.current_stock} {ingredient.unit}
                          </span>
                          {ingredient.maximum_stock && (
                            <span className="text-sm text-muted-foreground">
                              de {ingredient.maximum_stock} {ingredient.unit}
                            </span>
                          )}
                        </div>
                        {ingredient.maximum_stock && (
                          <Progress 
                            value={stockPercentage} 
                            className="h-2"
                          />
                        )}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Mín: {ingredient.minimum_stock}{ingredient.unit}</span>
                          {ingredient.maximum_stock && (
                            <span>{Math.round(stockPercentage)}%</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">Informações</div>
                      <div className="space-y-2">
                        {ingredient.cost_per_unit > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Preço:</span>
                            <span className="font-medium text-foreground">
                              R$ {ingredient.cost_per_unit.toFixed(2)}/{ingredient.unit}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Atualizado:</span>
                          <span className="font-medium text-foreground">
                            {new Date(ingredient.updated_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        {totalValue > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Valor total:</span>
                            <span className="font-medium text-primary">
                              R$ {totalValue.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">Ações</div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Entrada Estoque
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Ver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 flex items-center gap-2"
                            onClick={() => handleEdit(ingredient)}
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
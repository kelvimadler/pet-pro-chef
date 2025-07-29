import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Eye,
  Edit
} from "lucide-react";

export default function Inventory() {
  const ingredients = [
    {
      id: 1,
      name: "Peito de Frango",
      category: "Proteína",
      currentStock: 15,
      minStock: 10,
      maxStock: 50,
      unit: "kg",
      price: 18.50,
      supplier: "Frigorífico Santos",
      lastEntry: "2024-07-25",
      status: "normal"
    },
    {
      id: 2,
      name: "Batata Doce",
      category: "Carboidrato",
      currentStock: 4,
      minStock: 8,
      maxStock: 30,
      unit: "kg",
      price: 3.20,
      supplier: "Hortifruti Central",
      lastEntry: "2024-07-20",
      status: "low"
    },
    {
      id: 3,
      name: "Salmão Fresco",
      category: "Proteína",
      currentStock: 2,
      minStock: 5,
      maxStock: 20,
      unit: "kg", 
      price: 45.00,
      supplier: "Peixaria Premium",
      lastEntry: "2024-07-15",
      status: "critical"
    },
    {
      id: 4,
      name: "Aveia em Flocos",
      category: "Fibra",
      currentStock: 25,
      minStock: 15,
      maxStock: 40,
      unit: "kg",
      price: 8.90,
      supplier: "Distribuidora Grãos",
      lastEntry: "2024-07-28",
      status: "good"
    }
  ];

  const getStatusInfo = (ingredient: any) => {
    const percentage = (ingredient.currentStock / ingredient.maxStock) * 100;
    
    if (ingredient.currentStock <= ingredient.minStock * 0.5) {
      return {
        status: "critical",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: TrendingDown,
        iconColor: "text-red-600",
        label: "Crítico"
      };
    } else if (ingredient.currentStock <= ingredient.minStock) {
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
    return (ingredient.currentStock / ingredient.maxStock) * 100;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 25) return "bg-red-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Estoque</h1>
          <p className="text-muted-foreground mt-1">
            Controle inteligente de ingredientes
          </p>
        </div>
        <Button className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Ingrediente
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar ingredientes..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-4">
        {ingredients.map((ingredient) => {
          const statusInfo = getStatusInfo(ingredient);
          const stockPercentage = getStockPercentage(ingredient);
          const StatusIcon = statusInfo.icon;

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
                      Categoria: {ingredient.category} • {ingredient.supplier}
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
                          {ingredient.currentStock} {ingredient.unit}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          de {ingredient.maxStock} {ingredient.unit}
                        </span>
                      </div>
                      <Progress 
                        value={stockPercentage} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Mín: {ingredient.minStock}{ingredient.unit}</span>
                        <span>{Math.round(stockPercentage)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">Informações</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Preço:</span>
                        <span className="font-medium text-foreground">
                          R$ {ingredient.price.toFixed(2)}/{ingredient.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Última entrada:</span>
                        <span className="font-medium text-foreground">
                          {new Date(ingredient.lastEntry).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valor total:</span>
                        <span className="font-medium text-primary">
                          R$ {(ingredient.currentStock * ingredient.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">Ações</div>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar Estoque
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 flex items-center gap-2">
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
        })}
      </div>
    </div>
  );
}
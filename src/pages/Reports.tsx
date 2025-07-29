import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProductions } from "@/hooks/useProductions";
import { useIngredients } from "@/hooks/useIngredients";
import { useClients } from "@/hooks/useClients";
import { Suspense, lazy } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Calendar,
  Download,
  Filter,
  Users,
  ChefHat
} from "lucide-react";

export default function Reports() {
  const { productions } = useProductions();
  const { ingredients } = useIngredients();
  const { clients } = useClients();

  // Calculate real metrics
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const recentProductions = productions.filter(p => 
    new Date(p.production_date) >= last30Days
  );

  const finishedProductions = productions.filter(p => p.status === 'finished');
  
  // Calculate average yield
  const avgYield = finishedProductions.length > 0 
    ? finishedProductions
        .filter(p => p.yield_percentage)
        .reduce((sum, p) => sum + (p.yield_percentage || 0), 0) / 
      finishedProductions.filter(p => p.yield_percentage).length
    : 0;

  // Calculate total weight consumed (approximation based on productions)
  const totalWeightConsumed = finishedProductions.reduce((sum, p) => 
    sum + (p.frozen_weight || 0), 0
  );

  // Find most produced protein type
  const proteinCounts = productions.reduce((acc, p) => {
    if (p.protein_type) {
      acc[p.protein_type] = (acc[p.protein_type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostProducedProtein = Object.entries(proteinCounts)
    .sort(([,a], [,b]) => b - a)[0];

  const productionsByMonth = productions.reduce((acc, p) => {
    const month = new Date(p.production_date).toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(productionsByMonth).map(([month, count]) => ({
    month,
    producoes: count
  }));

  const proteinData = Object.entries(proteinCounts).map(([protein, count]) => ({
    name: protein,
    value: count
  }));

  // Simple chart component
  const SimpleBarChart = ({ data }: { data: any[] }) => (
    <div className="space-y-2">
      {data.slice(-6).map((item, index) => (
        <div key={item.month} className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground w-20">{item.month}</span>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden">
              <div 
                className="h-full bg-primary rounded-md transition-all duration-300" 
                style={{ width: `${(item.producoes / Math.max(...data.map(d => d.producoes))) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium w-8 text-right">{item.producoes}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Análises e métricas da produção
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 justify-center">
            <Filter className="w-4 h-4" />
            Filtrar Período
          </Button>
          <Button className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-card-hover border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Produção por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{recentProductions.length}</p>
            <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Consumo de Ingredientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{totalWeightConsumed.toFixed(0)}kg</p>
            <p className="text-sm text-muted-foreground">Total processado</p>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Eficiência Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {avgYield > 0 ? `${avgYield.toFixed(1)}%` : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">Rendimento</p>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Mais Produzido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-foreground">
              {mostProducedProtein ? mostProducedProtein[0] : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              {mostProducedProtein ? `${mostProducedProtein[1]} produções` : "Nenhuma produção"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Estatísticas de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total de clientes:</span>
              <span className="font-medium">{clients.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pets cadastrados:</span>
              <span className="font-medium">
                {clients.filter(c => c.pet_name).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Média de peso:</span>
              <span className="font-medium">
                {clients.filter(c => c.pet_weight).length > 0 
                  ? `${(clients.filter(c => c.pet_weight).reduce((sum, c) => sum + (c.pet_weight || 0), 0) / clients.filter(c => c.pet_weight).length).toFixed(1)}kg`
                  : "N/A"
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total ingredientes:</span>
              <span className="font-medium">{ingredients.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estoque baixo:</span>
              <span className="font-medium text-warning">
                {ingredients.filter(i => i.current_stock <= i.minimum_stock).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor total:</span>
              <span className="font-medium text-primary">
                R$ {ingredients.reduce((sum, i) => sum + (i.current_stock * (i.cost_per_unit || 0)), 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Produções por Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(productionsByMonth)
              .slice(-3)
              .map(([month, count]) => (
                <div key={month} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{month}:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(productionsByMonth))) * 100}%` }}
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Produções por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <SimpleBarChart data={chartData} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tipos de Proteína</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <div className="space-y-3">
                {proteinData.slice(0, 5).map((protein, index) => (
                  <div key={protein.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{protein.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${(protein.value / Math.max(...proteinData.map(p => p.value))) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{protein.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
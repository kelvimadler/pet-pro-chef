import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Calendar,
  Download,
  Filter
} from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Análises e métricas da produção
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card-hover border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Produção por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">45</p>
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
            <p className="text-2xl font-bold text-foreground">125kg</p>
            <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
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
            <p className="text-2xl font-bold text-foreground">78%</p>
            <p className="text-sm text-muted-foreground">Rendimento</p>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Produtos Mais Feitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-foreground">Snacks Frango</p>
            <p className="text-sm text-muted-foreground">15 produções</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Produção por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-natural rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de produção será implementado</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Consumo de Ingredientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-natural rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de consumo será implementado</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
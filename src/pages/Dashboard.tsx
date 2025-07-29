import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChefHat, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  Eye
} from "lucide-react";

export default function Dashboard() {
  // Mock data - em produção viria de uma API
  const metrics = [
    {
      title: "Produções Hoje",
      value: 8,
      icon: ChefHat,
      variant: "success" as const,
      subtitle: "3 em andamento",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Estoque Baixo",
      value: 5,
      icon: Package,
      variant: "warning" as const,
      subtitle: "Ingredientes",
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Vencendo Hoje",
      value: 12,
      icon: AlertTriangle,
      variant: "danger" as const,
      subtitle: "Produtos",
    },
    {
      title: "Rendimento Médio",
      value: "78%",
      icon: TrendingUp,
      variant: "default" as const,
      subtitle: "Últimos 30 dias",
      trend: { value: 5, isPositive: true }
    }
  ];

  const currentProductions = [
    {
      id: 1,
      name: "Snacks de Frango Desidratado",
      status: "Em Produção",
      startedAt: "08:30",
      stage: "Descongelamento",
      estimatedEnd: "14:30"
    },
    {
      id: 2,
      name: "Biscoitos de Batata Doce",
      status: "Preparação",
      startedAt: "09:15",
      stage: "Limpeza Inicial",
      estimatedEnd: "16:00"
    },
    {
      id: 3,
      name: "Petiscos de Salmão",
      status: "Finalização",
      startedAt: "07:00",
      stage: "Análise Visual",
      estimatedEnd: "13:00"
    }
  ];

  const expiringProducts = [
    {
      name: "Snacks de Frango - Lote 240728",
      expiresAt: "Hoje",
      quantity: "8 pacotes",
      severity: "high"
    },
    {
      name: "Biscoitos Integrais - Lote 240725",
      expiresAt: "Amanhã", 
      quantity: "15 pacotes",
      severity: "medium"
    },
    {
      name: "Petiscos Salmão - Lote 240720",
      expiresAt: "2 dias",
      quantity: "6 pacotes", 
      severity: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Produção":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Preparação":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Finalização":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral da sua fábrica de petiscos naturais
          </p>
        </div>
        <Button className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Nova Produção
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Productions */}
        <Card className="shadow-card-hover border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                Produções em Andamento
              </CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Ver Todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentProductions.map((production) => (
              <div
                key={production.id}
                className="p-4 rounded-lg border border-border/50 bg-accent/20 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground text-sm">
                    {production.name}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(production.status)}`}
                  >
                    {production.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {production.startedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Prev: {production.estimatedEnd}
                    </span>
                  </div>
                  <p className="text-primary font-medium">
                    Etapa: {production.stage}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expiring Products */}
        <Card className="shadow-card-hover border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Produtos Vencendo
              </CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Ver Todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {expiringProducts.map((product, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border/50 bg-accent/20 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground text-sm">
                    {product.name}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getSeverityColor(product.severity)}`}
                  >
                    {product.expiresAt}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {product.quantity}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
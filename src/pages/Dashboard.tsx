import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProductions } from "@/hooks/useProductions";
import { useIngredients } from "@/hooks/useIngredients";
import { useNotifications } from "@/hooks/useNotifications";
import { useLabels } from "@/hooks/useLabels";
import { useNavigate } from "react-router-dom";
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
  const { productions } = useProductions();
  const { getLowStockIngredients } = useIngredients();
  const { unreadCount } = useNotifications();
  const { getExpiringLabels } = useLabels();
  const navigate = useNavigate();
  
  const todayProductions = productions.filter(p => {
    const productionDate = p.production_date || p.created_at;
    return new Date(productionDate).toDateString() === new Date().toDateString();
  });
  const inProgressProductions = productions.filter(p => p.status === 'in_progress');
  const finishedProductions = productions.filter(p => p.status === 'finished');
  const lowStockIngredients = getLowStockIngredients();
  
  // Calculate average yield from finished productions
  const avgYield = finishedProductions.length > 0 
    ? finishedProductions
        .filter(p => p.yield_percentage)
        .reduce((sum, p) => sum + (p.yield_percentage || 0), 0) / 
      finishedProductions.filter(p => p.yield_percentage).length
    : 0;

  const metrics = [
    {
      title: "Total de Produções",
      value: finishedProductions.length,
      icon: ChefHat,
      variant: "success" as const,
      subtitle: `${inProgressProductions.length} em andamento`,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Estoque Baixo",
      value: lowStockIngredients.length,
      icon: Package,
      variant: "warning" as const,
      subtitle: "Ingredientes",
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Notificações",
      value: unreadCount,
      icon: AlertTriangle,
      variant: "danger" as const,
      subtitle: "Não lidas",
    },
    {
      title: "Rendimento Médio",
      value: avgYield > 0 ? `${avgYield.toFixed(1)}%` : "N/A",
      icon: TrendingUp,
      variant: "default" as const,
      subtitle: `${finishedProductions.length} produções`,
      trend: { value: 5, isPositive: true }
    }
  ];

  // Helper functions
  const getProductName = (production: any) => {
    return production.protein_type || "Produto personalizado";
  };

  const getProductionTime = (production: any) => {
    if (production.dehydrator_entry_time) {
      return new Date(production.dehydrator_entry_time).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return new Date(production.created_at).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCurrentStage = (production: any) => {
    if (production.dehydrator_exit_time) return 'Análise final';
    if (production.dehydrator_entry_time) return 'Desidratação';
    if (production.thaw_time) return 'Preparação';
    return 'Preparação inicial';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'Em Produção';
      case 'finished': return 'Finalizada';
      case 'open': return 'Aberta';
      default: return status;
    }
  };

  // Use real production data for current productions
  const currentProductions = inProgressProductions.slice(0, 3);

  // Get real expiring products from labels
  const expiringLabels = getExpiringLabels().slice(0, 3);
  const expiringProducts = expiringLabels.map(label => {
    const today = new Date();
    const expiry = new Date(label.expiry_date);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let expiresAt = '';
    let severity = 'low';
    
    if (daysUntilExpiry < 0) {
      expiresAt = 'Vencido';
      severity = 'high';
    } else if (daysUntilExpiry === 0) {
      expiresAt = 'Hoje';
      severity = 'high';
    } else if (daysUntilExpiry === 1) {
      expiresAt = 'Amanhã';
      severity = 'medium';
    } else {
      expiresAt = `${daysUntilExpiry} dias`;
      severity = 'low';
    }
    
    return {
      name: `${label.product_name} - ${label.batch_code}`,
      expiresAt,
      quantity: `${label.package_size}g`,
      severity
    };
  });

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
        <Button 
          onClick={() => navigate('/productions/new')}
          className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
        >
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
            {currentProductions.length === 0 ? (
              <div className="text-center py-8">
                <ChefHat className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Nenhuma produção em andamento</p>
              </div>
            ) : (
              currentProductions.map((production) => (
                <div
                  key={production.id}
                  className="p-4 rounded-lg border border-border/50 bg-accent/20 hover:bg-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm">
                      {getProductName(production)}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs bg-blue-100 text-blue-800 border-blue-200`}
                    >
                      {getStatusLabel(production.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getProductionTime(production)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Lote: {production.batch_code}
                      </span>
                    </div>
                    <p className="text-primary font-medium">
                      Etapa: {getCurrentStage(production)}
                    </p>
                  </div>
                </div>
              ))
            )}
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/labels')}
              >
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
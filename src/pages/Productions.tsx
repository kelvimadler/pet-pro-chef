import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProductions } from "@/hooks/useProductions";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  ChefHat, 
  Clock, 
  Package,
  Eye,
  Edit,
  Play,
  CheckCircle
} from "lucide-react";

export default function Productions() {
  const navigate = useNavigate();
  const { productions, loading, updateProduction } = useProductions();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  // Função para buscar nome do produto
  const getProductName = (productId: string | null) => {
    if (!productId) return "Produto personalizado";
    const product = products.find(p => p.id === productId);
    return product?.name || "Produto não encontrado";
  };

  // Filtrar produções baseado na busca
  const filteredProductions = productions.filter(production => {
    const productName = getProductName(production.product_id);
    return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           production.batch_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (production.protein_type && production.protein_type.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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

  const handleStartProduction = async (id: string) => {
    await updateProduction(id, { 
      status: 'in_progress',
      dehydrator_entry_time: new Date().toISOString()
    });
  };

  const handleFinishProduction = async (id: string) => {
    await updateProduction(id, { 
      status: 'finished',
      dehydrator_exit_time: new Date().toISOString(),
      visual_analysis: true,
      final_cleaning: true
    });
  };

  const getCurrentStage = (production: any) => {
    if (production.status === 'finished') return 'Concluída';
    if (production.status === 'open') return 'Aguardando início';
    
    if (production.dehydrator_exit_time) return 'Análise final';
    if (production.dehydrator_entry_time) return 'Desidratação';
    if (production.thaw_time) return 'Preparação';
    if (production.initial_cleaning) return 'Descongelamento';
    
    return 'Preparação inicial';
  };

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
          <h1 className="text-3xl font-bold text-foreground">Gestão de Produções</h1>
          <p className="text-muted-foreground mt-1">
            Controle completo do processo produtivo
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

      {/* Filters */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por produto, lote ou proteína..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Productions List */}
      <div className="grid gap-4">
        {filteredProductions.length === 0 ? (
          <Card className="shadow-card-hover border-border/50">
            <CardContent className="p-8 text-center">
              <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma produção encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Nenhuma produção corresponde aos critérios de busca." : "Comece criando sua primeira produção."}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => navigate('/productions/new')}
                  className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Produção
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredProductions.map((production) => (
            <Card key={production.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-primary" />
                      {getProductName(production.product_id)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Lote: {production.batch_code} • {production.protein_type}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(production.status)}
                  >
                    {getStatusLabel(production.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Cronograma</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground">
                        <span className="font-medium">Início:</span> {
                          production.production_date 
                            ? new Date(production.production_date).toLocaleDateString('pt-BR')
                            : "Não iniciado"
                        }
                      </p>
                      <p className="text-primary font-medium">
                        Etapa: {getCurrentStage(production)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>Pesagens</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground">
                        <span className="font-medium">Bruto:</span> {
                          production.frozen_weight ? `${production.frozen_weight}kg` : "N/A"
                        }
                      </p>
                      <p className="text-foreground">
                        <span className="font-medium">Final:</span> {
                          production.final_weight ? `${production.final_weight}kg` : "N/A"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>Resultado</span>
                    </div>
                    <div className="space-y-1">
                      {production.yield_percentage ? (
                        <>
                          <p className="text-lg font-bold text-primary">
                            {production.yield_percentage}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {production.packages_60g} × 60g • {production.packages_150g} × 150g
                          </p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">Aguardando finalização</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  {production.status === 'open' && (
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStartProduction(production.id)}
                    >
                      <Play className="w-4 h-4" />
                      Iniciar
                    </Button>
                  )}
                  {production.status === 'in_progress' && (
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => handleFinishProduction(production.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Finalizar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
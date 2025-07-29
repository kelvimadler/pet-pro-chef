import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductions } from "@/hooks/useProductions";
import { ArrowLeft, ChefHat, Clock, Package, Edit, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productions, updateProduction } = useProductions();
  const { toast } = useToast();
  const [production, setProduction] = useState<any>(null);

  useEffect(() => {
    const foundProduction = productions.find(p => p.id === id);
    setProduction(foundProduction);
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

  const canStartProduction = () => {
    return production.initial_cleaning && 
           production.epi_used && 
           production.frozen_weight && 
           production.thawed_weight;
  };

  const handleStartProduction = async () => {
    if (!canStartProduction()) {
      toast({
        title: "Etapas incompletas",
        description: "Complete todas as etapas obrigatórias antes de iniciar a produção",
        variant: "destructive",
      });
      return;
    }
    
    await updateProduction(production.id, { 
      status: 'in_progress'
    });
  };

  const handleFinishProduction = async () => {
    await updateProduction(production.id, { 
      status: 'finished',
      dehydrator_exit_time: new Date().toISOString(),
      visual_analysis: true,
      final_cleaning: true
    });
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
          <h1 className="text-3xl font-bold text-foreground">Detalhes da Produção</h1>
          <p className="text-muted-foreground mt-1">
            Lote: {production.batch_code}
          </p>
        </div>
        <Badge variant="outline" className={getStatusColor(production.status)}>
          {getStatusLabel(production.status)}
        </Badge>
      </div>

      {/* Production Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Código do Lote</p>
                <p className="font-medium">{production.batch_code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proteína</p>
                <p className="font-medium">{production.protein_type || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Produção</p>
                <p className="font-medium">
                  {new Date(production.production_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className={getStatusColor(production.status)}>
                  {getStatusLabel(production.status)}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Preparação Inicial</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Limpeza inicial:</span>
                  <span className={production.initial_cleaning ? "text-green-600" : "text-red-600"}>
                    {production.initial_cleaning ? "✓ Sim" : "✗ Não"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>EPI utilizado:</span>
                  <span className={production.epi_used ? "text-green-600" : "text-red-600"}>
                    {production.epi_used ? "✓ Sim" : "✗ Não"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Pesagens e Rendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Peso Congelado</p>
                <p className="font-medium">{production.frozen_weight ? `${production.frozen_weight}kg` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso Descongelado</p>
                <p className="font-medium">{production.thawed_weight ? `${production.thawed_weight}kg` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso Limpo</p>
                <p className="font-medium">{production.clean_weight ? `${production.clean_weight}kg` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peso Final</p>
                <p className="font-medium">{production.final_weight ? `${production.final_weight}kg` : "N/A"}</p>
              </div>
            </div>

            {production.yield_percentage && (
              <div className="pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Rendimento</p>
                  <p className="text-3xl font-bold text-primary">{production.yield_percentage}%</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pacotes 60g</p>
                    <p className="font-medium">{production.packages_60g}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pacotes 150g</p>
                    <p className="font-medium">{production.packages_150g}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="shadow-card-hover border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Cronograma de Produção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {production.thaw_time && (
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Descongelamento</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(production.thaw_time).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
            
            {production.dehydrator_entry_time && (
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Entrada na Desidratadora</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(production.dehydrator_entry_time).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}

            {production.dehydrator_exit_time && (
              <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Saída da Desidratadora</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(production.dehydrator_exit_time).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/productions/edit/${production.id}`)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar
        </Button>
        
        {production.status === 'open' && (
          <Button 
            onClick={handleStartProduction}
            disabled={!canStartProduction()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            Iniciar Produção
          </Button>
        )}
        
        {production.status === 'in_progress' && (
          <Button 
            onClick={handleFinishProduction}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            Finalizar Produção
          </Button>
        )}
      </div>
    </div>
  );
}
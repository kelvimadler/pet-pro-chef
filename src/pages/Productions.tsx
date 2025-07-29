import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  ChefHat, 
  Clock, 
  Package,
  Eye,
  Edit
} from "lucide-react";

export default function Productions() {
  const productions = [
    {
      id: 1,
      name: "Snacks de Frango Desidratado",
      description: "Petiscos naturais de peito de frango desidratado",
      status: "Em Produção",
      startedAt: "2024-07-29 08:30",
      stage: "Descongelamento",
      rendimento: null,
      pesoBruto: "2.5kg",
      pesoFinal: null
    },
    {
      id: 2,
      name: "Biscoitos de Batata Doce",
      description: "Biscoitos integrais com batata doce e aveia",
      status: "Finalizada",
      startedAt: "2024-07-28 07:00",
      stage: "Concluída",
      rendimento: "78%",
      pesoBruto: "3.2kg",
      pesoFinal: "2.5kg"
    },
    {
      id: 3,
      name: "Petiscos de Salmão",
      description: "Cubos de salmão desidratado premium",
      status: "Aberta",
      startedAt: null,
      stage: "Aguardando início",
      rendimento: null,
      pesoBruto: null,
      pesoFinal: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Produção":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Finalizada":
        return "bg-green-100 text-green-800 border-green-200";
      case "Aberta":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
        <Button className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
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
                placeholder="Buscar por nome do produto..." 
                className="pl-10"
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
        {productions.map((production) => (
          <Card key={production.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-primary" />
                    {production.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {production.description}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(production.status)}
                >
                  {production.status}
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
                      <span className="font-medium">Início:</span> {production.startedAt || "Não iniciado"}
                    </p>
                    <p className="text-primary font-medium">
                      Etapa: {production.stage}
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
                      <span className="font-medium">Bruto:</span> {production.pesoBruto || "N/A"}
                    </p>
                    <p className="text-foreground">
                      <span className="font-medium">Final:</span> {production.pesoFinal || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>Resultado</span>
                  </div>
                  <div className="space-y-1">
                    {production.rendimento ? (
                      <p className="text-lg font-bold text-primary">
                        {production.rendimento}
                      </p>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
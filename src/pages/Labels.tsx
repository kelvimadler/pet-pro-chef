import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  QrCode, 
  Calendar, 
  AlertTriangle,
  Printer,
  Search,
  Eye
} from "lucide-react";

export default function Labels() {
  const products = [
    {
      id: 1,
      name: "Snacks de Frango Desidratado",
      batch: "LOT240729001",
      productionDate: "2024-07-29",
      expiryDate: "2024-09-29",
      quantity: 24,
      packageSize: "60g",
      status: "valid"
    },
    {
      id: 2,
      name: "Biscoitos de Batata Doce", 
      batch: "LOT240728002",
      productionDate: "2024-07-28",
      expiryDate: "2024-07-30",
      quantity: 15,
      packageSize: "150g", 
      status: "expiring"
    },
    {
      id: 3,
      name: "Petiscos de Salmão",
      batch: "LOT240725003", 
      productionDate: "2024-07-25",
      expiryDate: "2024-07-28",
      quantity: 8,
      packageSize: "60g",
      status: "expired"
    }
  ];

  const getStatusInfo = (status: string, expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (status === "expired" || daysUntilExpiry < 0) {
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Vencido",
        urgency: "high"
      };
    } else if (daysUntilExpiry <= 2) {
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        label: "Vence em breve",
        urgency: "medium"
      };
    } else {
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Válido",
        urgency: "low"
      };
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Vencido";
    if (days === 0) return "Vence hoje";
    if (days === 1) return "Vence amanhã";
    return `${days} dias`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Etiquetas</h1>
          <p className="text-muted-foreground mt-1">
            Controle de validade e impressão de etiquetas
          </p>
        </div>
        <Button className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir Lote
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por produto ou lote..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="grid gap-4">
        {products.map((product) => {
          const statusInfo = getStatusInfo(product.status, product.expiryDate);
          const daysInfo = getDaysUntilExpiry(product.expiryDate);

          return (
            <Card key={product.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-primary" />
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Lote: {product.batch} • {product.quantity} unidades ({product.packageSize})
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={statusInfo.color}
                  >
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Datas</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fabricação:</span>
                        <span className="font-medium text-foreground">
                          {new Date(product.productionDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validade:</span>
                        <span className="font-medium text-foreground">
                          {new Date(product.expiryDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Status</span>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-3">
                      <p className={`text-lg font-bold ${
                        statusInfo.urgency === "high" ? "text-red-600" :
                        statusInfo.urgency === "medium" ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {daysInfo}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        até o vencimento
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground font-medium">Ações</div>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          window.print();
                        }}
                      >
                        <Printer className="w-4 h-4" />
                        Imprimir Etiquetas
                      </Button>
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Visualizar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Label Preview */}
                <div className="border-t border-border/50 pt-4">
                  <div className="text-sm text-muted-foreground mb-2">Preview da Etiqueta:</div>
                  <div className="bg-white border border-border rounded-lg p-4 max-w-sm">
                    <div className="text-center space-y-2">
                      <h4 className="font-bold text-sm text-gray-900">{product.name}</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Lote: {product.batch}</p>
                        <p>Fabricação: {new Date(product.productionDate).toLocaleDateString("pt-BR")}</p>
                        <p>Validade: {new Date(product.expiryDate).toLocaleDateString("pt-BR")}</p>
                        <p>Peso: {product.packageSize}</p>
                      </div>
                      <div className="bg-gray-100 h-8 flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-gray-400" />
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
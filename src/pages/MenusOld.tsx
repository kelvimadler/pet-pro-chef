import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Utensils, 
  User, 
  Heart,
  Eye,
  Edit,
  Printer
} from "lucide-react";

export default function Menus() {
  const menus = [
    {
      id: 1,
      clientId: "CLI001",
      petName: "Thor",
      tutorName: "Ana Silva",
      petWeight: "25kg",
      breed: "Golden Retriever",
      dailyRation: "400g",
      mealsPerDay: 2,
      status: "Ativo",
      createdAt: "2024-07-25",
      ingredients: [
        { name: "Ração Premium", quantity: "300g" },
        { name: "Peito de Frango", quantity: "100g" },
        { name: "Batata Doce", quantity: "50g" },
        { name: "Cenoura", quantity: "30g" }
      ],
      observations: "Alergia a milho. Evitar corantes artificiais."
    },
    {
      id: 2,
      clientId: "CLI002", 
      petName: "Luna",
      tutorName: "Carlos Santos",
      petWeight: "8kg",
      breed: "Shih Tzu",
      dailyRation: "180g",
      mealsPerDay: 3,
      status: "Ativo",
      createdAt: "2024-07-20",
      ingredients: [
        { name: "Ração Small Breed", quantity: "120g" },
        { name: "Salmão", quantity: "40g" },
        { name: "Abóbora", quantity: "20g" }
      ],
      observations: "Pet sensível. Transição gradual de alimentos."
    },
    {
      id: 3,
      clientId: "CLI003",
      petName: "Rex", 
      tutorName: "Maria Oliveira",
      petWeight: "32kg",
      breed: "Pastor Alemão",
      dailyRation: "500g",
      mealsPerDay: 2,
      status: "Inativo",
      createdAt: "2024-07-15",
      ingredients: [
        { name: "Ração Large Breed", quantity: "350g" },
        { name: "Carne Bovina", quantity: "120g" },
        { name: "Arroz Integral", quantity: "30g" }
      ],
      observations: "Cardápio suspenso temporariamente."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inativo":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cardápios Personalizados</h1>
          <p className="text-muted-foreground mt-1">
            Dietas customizadas para cada pet
          </p>
        </div>
        <Button className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cardápio
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por cliente, pet ou tutor..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Menus List */}
      <div className="grid gap-4">
        {menus.map((menu) => (
          <Card key={menu.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    {menu.petName} - {menu.breed}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {menu.tutorName}
                    </span>
                    <span>ID: {menu.clientId}</span>
                    <span>Peso: {menu.petWeight}</span>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(menu.status)}
                >
                  {menu.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Utensils className="w-4 h-4" />
                    <span className="font-medium">Dieta Diária</span>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ração Total:</span>
                      <span className="font-medium text-foreground">{menu.dailyRation}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Refeições:</span>
                      <span className="font-medium text-foreground">{menu.mealsPerDay}x ao dia</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Por refeição:</span>
                      <span className="font-medium text-primary">
                        {Math.round(parseInt(menu.dailyRation) / menu.mealsPerDay)}g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Utensils className="w-4 h-4" />
                    <span className="font-medium">Ingredientes</span>
                  </div>
                  <div className="space-y-2">
                    {menu.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between text-sm bg-accent/20 rounded px-3 py-2">
                        <span className="text-foreground">{ingredient.name}</span>
                        <span className="font-medium text-primary">{ingredient.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {menu.observations && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm font-medium text-warning-foreground mb-1">Observações:</p>
                  <p className="text-sm text-muted-foreground">{menu.observations}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Imprimir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail,
  MapPin,
  Heart,
  Eye,
  Edit
} from "lucide-react";

export default function Clients() {
  const clients = [
    {
      id: "CLI001",
      name: "Ana Silva",
      email: "ana.silva@email.com",
      phone: "(11) 99999-1234",
      address: "Rua das Flores, 123 - São Paulo/SP",
      registeredAt: "2024-06-15",
      pets: [
        { name: "Thor", breed: "Golden Retriever", age: "3 anos" },
        { name: "Bella", breed: "Labrador", age: "2 anos" }
      ],
      activeMenus: 2,
      totalOrders: 15,
      status: "Ativo"
    },
    {
      id: "CLI002", 
      name: "Carlos Santos",
      email: "carlos.santos@email.com",
      phone: "(11) 98888-5678",
      address: "Av. Principal, 456 - São Paulo/SP",
      registeredAt: "2024-07-01",
      pets: [
        { name: "Luna", breed: "Shih Tzu", age: "5 anos" }
      ],
      activeMenus: 1,
      totalOrders: 8,
      status: "Ativo"
    },
    {
      id: "CLI003",
      name: "Maria Oliveira", 
      email: "maria.oliveira@email.com",
      phone: "(11) 97777-9012",
      address: "Rua Central, 789 - São Paulo/SP",
      registeredAt: "2024-05-20",
      pets: [
        { name: "Rex", breed: "Pastor Alemão", age: "4 anos" },
        { name: "Nina", breed: "Border Collie", age: "1 ano" }
      ],
      activeMenus: 0,
      totalOrders: 22,
      status: "Inativo"
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
          <h1 className="text-3xl font-bold text-foreground">Gestão de Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Cadastro e acompanhamento de clientes e pets
          </p>
        </div>
        <Button className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, email ou ID..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {client.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ID: {client.id} • Cliente desde {new Date(client.registeredAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(client.status)}
                >
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground font-medium">Contato</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{client.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-foreground">{client.address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">Pets</span>
                  </div>
                  <div className="space-y-2">
                    {client.pets.map((pet, index) => (
                      <div key={index} className="bg-accent/30 rounded-lg p-3">
                        <p className="font-medium text-foreground text-sm">{pet.name}</p>
                        <p className="text-xs text-muted-foreground">{pet.breed} • {pet.age}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground font-medium">Estatísticas</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cardápios ativos:</span>
                      <span className="font-medium text-primary">{client.activeMenus}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total de pedidos:</span>
                      <span className="font-medium text-foreground">{client.totalOrders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pets cadastrados:</span>
                      <span className="font-medium text-foreground">{client.pets.length}</span>
                    </div>
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
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Cardápios
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
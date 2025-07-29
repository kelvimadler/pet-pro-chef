import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/useClients";
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
  const { clients, loading, createClient, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pet_name: '',
    pet_breed: '',
    pet_weight: '',
    notes: ''
  });

  const mockClients = [
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClient({
      ...formData,
      pet_weight: formData.pet_weight ? parseFloat(formData.pet_weight) : null
    });
    setShowDialog(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      pet_name: '',
      pet_breed: '',
      pet_weight: '',
      notes: ''
    });
  };

  const allClients = [...clients, ...mockClients];
  const filteredClients = allClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet-name">Nome do Pet</Label>
                  <Input
                    id="pet-name"
                    value={formData.pet_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, pet_name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pet-breed">Raça do Pet</Label>
                  <Input
                    id="pet-breed"
                    value={formData.pet_breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, pet_breed: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet-weight">Peso do Pet (kg)</Label>
                  <Input
                    id="pet-weight"
                    type="number"
                    step="0.1"
                    value={formData.pet_weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, pet_weight: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-primary">
                  Criar Cliente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, email ou ID..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {client.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ID: {client.id} • Cliente desde {new Date((client as any).registeredAt || (client as any).created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                   className={getStatusColor((client as any).status || 'Ativo')}
                 >
                   {(client as any).status || 'Ativo'}
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
                    {((client as any).pets || []).map((pet: any, index: number) => (
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
                      <span className="font-medium text-primary">{(client as any).activeMenus || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total de pedidos:</span>
                      <span className="font-medium text-foreground">{(client as any).totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pets cadastrados:</span>
                      <span className="font-medium text-foreground">{((client as any).pets || []).length}</span>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (confirm(`Deseja excluir o cliente ${client.name}?`)) {
                      if (client.id.startsWith('CLI')) {
                        alert('Cliente de exemplo não pode ser excluído');
                      } else {
                        deleteClient(client.id);
                      }
                    }
                  }}
                >
                  <Heart className="w-4 h-4" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
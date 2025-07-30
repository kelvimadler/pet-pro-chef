import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/useClients";
import { usePets } from "@/hooks/usePets";
import { useMenus } from "@/hooks/useMenus";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail,
  MapPin,
  Heart,
  Eye,
  Edit,
  X
} from "lucide-react";

export default function Clients() {
  const { clients, loading, createClient, deleteClient, updateClient } = useClients();
  const { createPet } = usePets();
  const { menus } = useMenus();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cpf: '',
    whatsapp: '',
    pet_name: '',
    pet_breed: '',
    pet_weight: '',
    pet_species: '',
    pet_sex: '',
    pet_birth_date: '',
    notes: ''
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cpf: '',
    whatsapp: '',
    pet_name: '',
    pet_breed: '',
    pet_weight: '',
    pet_species: '',
    pet_sex: '',
    pet_birth_date: '',
    notes: '',
    pets: [] as Array<{ name: string; breed: string; weight: number | null; species: string; sex: string; birth_date: string }>,
  });

  // Only use real clients from Supabase

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
      cpf: '',
      whatsapp: '',
      pet_name: '',
      pet_breed: '',
      pet_weight: '',
      pet_species: '',
      pet_sex: '',
      pet_birth_date: '',
      notes: ''
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    // Filter out empty pets before saving
    const validPets = editFormData.pets.filter(pet => 
      pet.name.trim() !== '' && pet.breed.trim() !== ''
    );
    
    // Save additional pets to pets table
    for (const pet of validPets) {
      await createPet({
        client_id: selectedClient.id,
        name: pet.name,
        breed: pet.breed,
        weight: pet.weight,
        species: pet.species || '',
        sex: pet.sex || '',
        birth_date: pet.birth_date || null,
        notes: ''
      });
    }
    
    await updateClient(selectedClient.id, {
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      address: editFormData.address,
      cpf: editFormData.cpf,
      whatsapp: editFormData.whatsapp,
      pet_name: editFormData.pet_name,
      pet_breed: editFormData.pet_breed,
      pet_weight: editFormData.pet_weight ? parseFloat(editFormData.pet_weight) : null,
      notes: editFormData.notes
    });
    setEditDialog(false);
    setSelectedClient(null);
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setEditFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      cpf: client.cpf || '',
      whatsapp: client.whatsapp || '',
      pet_name: client.pet_name || '',
      pet_breed: client.pet_breed || '',
      pet_weight: client.pet_weight?.toString() || '',
      pet_species: client.pet_species || '',
      pet_sex: client.pet_sex || '',
      pet_birth_date: client.pet_birth_date || '',
      notes: client.notes || '',
      pets: []
    });
    setEditDialog(true);
  };

  const handleView = (client: any) => {
    setSelectedClient(client);
    setViewDialog(true);
  };

  const filteredClients = clients.filter(client =>
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
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
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
                  <Label htmlFor="pet-species">Espécie do Pet</Label>
                  <Select value={formData.pet_species} onValueChange={(value) => setFormData(prev => ({ ...prev, pet_species: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a espécie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cão">Cão</SelectItem>
                      <SelectItem value="Gato">Gato</SelectItem>
                      <SelectItem value="Ave">Ave</SelectItem>
                      <SelectItem value="Roedor">Roedor</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="pet-sex">Sexo do Pet</Label>
                  <Select value={formData.pet_sex} onValueChange={(value) => setFormData(prev => ({ ...prev, pet_sex: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Fêmea">Fêmea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet-birth-date">Nascimento do Pet</Label>
                  <Input
                    id="pet-birth-date"
                    type="date"
                    value={formData.pet_birth_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, pet_birth_date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas do Cliente</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações, preferências alimentares, alergias, etc."
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
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <Card className="shadow-card-hover border-border/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado para a busca." : "Nenhum cliente cadastrado ainda."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map((client) => (
          <Card key={client.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {client.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Cliente desde {new Date(client.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  Ativo
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
                    {client.pet_name ? (
                      <div className="bg-accent/30 rounded-lg p-3">
                        <p className="font-medium text-foreground text-sm">{client.pet_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.pet_breed} {client.pet_weight && `• ${client.pet_weight}kg`}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Nenhum pet cadastrado</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground font-medium">Estatísticas</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cardápios ativos:</span>
                      <span className="font-medium text-primary">
                        {menus.filter(menu => menu.client_id === client.id && menu.is_active).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total de pedidos:</span>
                      <span className="font-medium text-foreground">0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pets cadastrados:</span>
                      <span className="font-medium text-foreground">{client.pet_name ? 1 : 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => handleView(client)}
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => handleEdit(client)}
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    if (confirm(`Deseja excluir o cliente ${client.name}?`)) {
                      deleteClient(client.id);
                    }
                  }}
                >
                  <Heart className="w-4 h-4" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* View Client Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {selectedClient?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Informações de Contato</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Email:</span> {selectedClient.email || 'Não informado'}</p>
                    <p><span className="text-muted-foreground">Telefone:</span> {selectedClient.phone || 'Não informado'}</p>
                    <p><span className="text-muted-foreground">Endereço:</span> {selectedClient.address || 'Não informado'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Informações do Pet</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Nome:</span> {selectedClient.pet_name || 'Não informado'}</p>
                    <p><span className="text-muted-foreground">Raça:</span> {selectedClient.pet_breed || 'Não informado'}</p>
                    <p><span className="text-muted-foreground">Peso:</span> {selectedClient.pet_weight ? `${selectedClient.pet_weight}kg` : 'Não informado'}</p>
                  </div>
                </div>
              </div>
              {selectedClient.notes && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Observações</h3>
                  <p className="text-sm text-muted-foreground bg-accent/20 p-3 rounded-lg">{selectedClient.notes}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Informações do Sistema</h3>
                <div className="text-sm text-muted-foreground">
                  <p>Cliente desde: {new Date(selectedClient.created_at).toLocaleDateString('pt-BR')}</p>
                  <p>Última atualização: {new Date(selectedClient.updated_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-whatsapp">WhatsApp</Label>
                <Input
                  id="edit-whatsapp"
                  value={editFormData.whatsapp}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cpf">CPF</Label>
                <Input
                  id="edit-cpf"
                  value={editFormData.cpf}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, cpf: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pet-name">Nome do Pet</Label>
                <Input
                  id="edit-pet-name"
                  value={editFormData.pet_name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, pet_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={editFormData.address}
                onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pet-breed">Raça do Pet</Label>
                <Input
                  id="edit-pet-breed"
                  value={editFormData.pet_breed}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, pet_breed: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pet-species">Espécie do Pet</Label>
                <Select value={editFormData.pet_species} onValueChange={(value) => setEditFormData(prev => ({ ...prev, pet_species: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a espécie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cão">Cão</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Ave">Ave</SelectItem>
                    <SelectItem value="Roedor">Roedor</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pet-weight">Peso do Pet (kg)</Label>
                <Input
                  id="edit-pet-weight"
                  type="number"
                  step="0.1"
                  value={editFormData.pet_weight}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, pet_weight: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pet-sex">Sexo do Pet</Label>
                <Select value={editFormData.pet_sex} onValueChange={(value) => setEditFormData(prev => ({ ...prev, pet_sex: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pet-birth-date">Nascimento do Pet</Label>
                <Input
                  id="edit-pet-birth-date"
                  type="date"
                  value={editFormData.pet_birth_date}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, pet_birth_date: e.target.value }))}
                />
              </div>
            </div>
            
            {/* Multiple pets section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Pets Adicionais
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditFormData({
                      ...editFormData,
                      pets: [...(editFormData.pets || []), { name: '', breed: '', weight: null, species: '', sex: '', birth_date: '' }]
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pet
                </Button>
              </div>
              
              {/* Multiple pets */}
              {editFormData.pets && editFormData.pets.map((pet, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative mb-4">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-sm">Pet {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newPets = editFormData.pets?.filter((_, i) => i !== index) || [];
                        setEditFormData({ ...editFormData, pets: newPets });
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Nome do Pet</Label>
                       <Input
                         value={pet.name || ''}
                         onChange={(e) => {
                           const newPets = [...(editFormData.pets || [])];
                           newPets[index] = { ...pet, name: e.target.value };
                           setEditFormData({ ...editFormData, pets: newPets });
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Raça</Label>
                       <Input
                         value={pet.breed || ''}
                         onChange={(e) => {
                           const newPets = [...(editFormData.pets || [])];
                           newPets[index] = { ...pet, breed: e.target.value };
                           setEditFormData({ ...editFormData, pets: newPets });
                         }}
                       />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Espécie</Label>
                       <Select 
                         value={pet.species || ''} 
                         onValueChange={(value) => {
                           const newPets = [...(editFormData.pets || [])];
                           newPets[index] = { ...pet, species: value };
                           setEditFormData({ ...editFormData, pets: newPets });
                         }}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Selecione" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Cão">Cão</SelectItem>
                           <SelectItem value="Gato">Gato</SelectItem>
                           <SelectItem value="Ave">Ave</SelectItem>
                           <SelectItem value="Roedor">Roedor</SelectItem>
                           <SelectItem value="Outro">Outro</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="space-y-2">
                       <Label>Sexo</Label>
                       <Select 
                         value={pet.sex || ''} 
                         onValueChange={(value) => {
                           const newPets = [...(editFormData.pets || [])];
                           newPets[index] = { ...pet, sex: value };
                           setEditFormData({ ...editFormData, pets: newPets });
                         }}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Sexo" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Macho">Macho</SelectItem>
                           <SelectItem value="Fêmea">Fêmea</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Peso (kg)</Label>
                       <Input
                         type="number"
                         step="0.1"
                         value={pet.weight || ''}
                         onChange={(e) => {
                           const newPets = [...(editFormData.pets || [])];
                           newPets[index] = { ...pet, weight: parseFloat(e.target.value) || null };
                           setEditFormData({ ...editFormData, pets: newPets });
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Nascimento</Label>
                       <Input
                         type="date"
                         value={pet.birth_date || ''}
                         onChange={(e) => {
                           const newPets = [...(editFormData.pets || [])];
                           newPets[index] = { ...pet, birth_date: e.target.value };
                           setEditFormData({ ...editFormData, pets: newPets });
                         }}
                       />
                     </div>
                   </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notas do Cliente</Label>
              <Textarea
                id="edit-notes"
                placeholder="Observações, preferências alimentares, alergias, etc."
                value={editFormData.notes}
                onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
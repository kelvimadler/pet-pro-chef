import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useClients } from "@/hooks/useClients";
import { usePets } from "@/hooks/usePets";
import { 
  Users, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Clients() {
  const { clients, loading, createClient, deleteClient, updateClient } = useClients();
  const { pets, createPet, updatePet, deletePet } = usePets();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    // Dados do tutor
    name: '',
    cpf: '',
    address: '',
    phone: '',
    email: '',
    // Dados do primeiro pet
    petName: '',
    petAge: '',
    petBirthDate: '',
    petWeight: '',
    petBreed: '',
    petSpecies: '',
    petSex: ''
  });

  const [editFormData, setEditFormData] = useState({
    // Dados do tutor
    name: '',
    cpf: '',
    address: '',
    phone: '',
    email: '',
    // Pets adicionais
    newPets: [] as Array<{
      name: string;
      age: string;
      birth_date: string;
      weight: string;
      breed: string;
      species: string;
      sex: string;
    }>
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.petName.trim()) {
      toast({
        title: "Nome do pet obrigatório",
        description: "É necessário informar pelo menos um pet para gerar a senha do cliente",
        variant: "destructive",
      });
      return;
    }

    // Criar cliente
    const client = await createClient({
      name: formData.name,
      cpf: formData.cpf || null,
      address: formData.address || null,
      phone: formData.phone || null,
      email: formData.email || null,
    }, formData.petName);

    if (client) {
      // Criar o primeiro pet
      await createPet({
        client_id: client.id,
        name: formData.petName,
        age: formData.petAge || null,
        birth_date: formData.petBirthDate || null,
        weight: formData.petWeight ? parseFloat(formData.petWeight) : null,
        breed: formData.petBreed || null,
        species: formData.petSpecies || null,
        sex: formData.petSex || null,
      });

      setShowDialog(false);
      resetForm();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    // Atualizar dados do cliente
    await updateClient(selectedClient.id, {
      name: editFormData.name,
      cpf: editFormData.cpf || null,
      address: editFormData.address || null,
      phone: editFormData.phone || null,
      email: editFormData.email || null,
    });

    // Criar novos pets
    for (const pet of editFormData.newPets) {
      if (pet.name.trim()) {
        await createPet({
          client_id: selectedClient.id,
          name: pet.name,
          age: pet.age || null,
          birth_date: pet.birth_date || null,
          weight: pet.weight ? parseFloat(pet.weight) : null,
          breed: pet.breed || null,
          species: pet.species || null,
          sex: pet.sex || null,
        });
      }
    }
    
    setEditDialog(false);
    setSelectedClient(null);
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setEditFormData({
      name: client.name || '',
      cpf: client.cpf || '',
      address: client.address || '',
      phone: client.phone || '',
      email: client.email || '',
      newPets: []
    });
    setEditDialog(true);
  };

  const handleView = (client: any) => {
    setSelectedClient(client);
    setViewDialog(true);
  };

  const handleDelete = async (clientId: string) => {
    await deleteClient(clientId);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cpf: '',
      address: '',
      phone: '',
      email: '',
      petName: '',
      petAge: '',
      petBirthDate: '',
      petWeight: '',
      petBreed: '',
      petSpecies: '',
      petSex: ''
    });
  };

  const addNewPet = () => {
    setEditFormData(prev => ({
      ...prev,
      newPets: [...prev.newPets, {
        name: '',
        age: '',
        birth_date: '',
        weight: '',
        breed: '',
        species: '',
        sex: ''
      }]
    }));
  };

  const removeNewPet = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      newPets: prev.newPets.filter((_, i) => i !== index)
    }));
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Senha copiada!",
      description: "A senha foi copiada para a área de transferência.",
    });
  };

  const getClientPets = (clientId: string) => {
    return pets.filter(pet => pet.client_id === clientId);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.password.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header - Mobile First */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestão de Clientes</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Cadastro e acompanhamento de clientes e pets
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-gradient-primary hover:scale-105 transition-transform shadow-elegant">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dados do Tutor */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Dados do Tutor</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
              </div>

              {/* Dados do Pet */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Dados do Pet</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="petName">Nome do Pet *</Label>
                    <Input
                      id="petName"
                      value={formData.petName}
                      onChange={(e) => setFormData(prev => ({ ...prev, petName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="petAge">Idade</Label>
                    <Input
                      id="petAge"
                      value={formData.petAge}
                      onChange={(e) => setFormData(prev => ({ ...prev, petAge: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="petBirthDate">Data de Nascimento</Label>
                    <Input
                      id="petBirthDate"
                      type="date"
                      value={formData.petBirthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, petBirthDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="petWeight">Peso (kg)</Label>
                    <Input
                      id="petWeight"
                      type="number"
                      step="0.1"
                      value={formData.petWeight}
                      onChange={(e) => setFormData(prev => ({ ...prev, petWeight: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="petBreed">Raça</Label>
                    <Input
                      id="petBreed"
                      value={formData.petBreed}
                      onChange={(e) => setFormData(prev => ({ ...prev, petBreed: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="petSpecies">Espécie</Label>
                    <Select value={formData.petSpecies} onValueChange={(value) => setFormData(prev => ({ ...prev, petSpecies: value }))}>
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
                <div className="space-y-2">
                  <Label htmlFor="petSex">Sexo</Label>
                  <Select value={formData.petSex} onValueChange={(value) => setFormData(prev => ({ ...prev, petSex: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Fêmea">Fêmea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              placeholder="Buscar por nome, senha ou email..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="shadow-card-hover border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clientes Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Carregando clientes...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado para a busca." : "Nenhum cliente cadastrado ainda."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table - Hidden on Mobile */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Senha</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>Nome do Tutor</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => {
                      const clientPets = getClientPets(client.id);
                      return (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="bg-accent px-2 py-1 rounded text-sm font-mono">
                                {client.password}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyPassword(client.password)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {clientPets.length > 0 ? (
                              <div className="space-y-1">
                                <p className="font-medium">{clientPets[0].name}</p>
                                {clientPets.length > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{clientPets.length - 1} pets
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Nenhum pet</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.phone || '-'}</TableCell>
                          <TableCell>{client.email || '-'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{client.address || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(client)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(client)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(client.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards - Visible on Mobile */}
              <div className="lg:hidden space-y-4">
                {filteredClients.map((client) => {
                  const clientPets = getClientPets(client.id);
                  return (
                    <Card key={client.id} className="border-border/50 shadow-card-hover">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Header with Password and Main Pet */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <code className="bg-accent px-2 py-1 rounded text-xs font-mono">
                                  {client.password}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyPassword(client.password)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{client.name}</h3>
                                {clientPets.length > 0 ? (
                                  <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">{clientPets[0].name}</span>
                                    {clientPets.length > 1 && (
                                      <span> (+{clientPets.length - 1} pets)</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Nenhum pet</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-1 text-sm">
                            {client.phone && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="font-medium">Tel:</span>
                                <span>{client.phone}</span>
                              </div>
                            )}
                            {client.email && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="font-medium">Email:</span>
                                <span className="truncate">{client.email}</span>
                              </div>
                            )}
                            {client.address && (
                              <div className="flex items-start gap-2 text-muted-foreground">
                                <span className="font-medium">End:</span>
                                <span className="line-clamp-2">{client.address}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(client)}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(client)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="w-[95vw] max-w-[400px]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                  <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(client.id)}
                                    className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Client Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados do Tutor</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                    <p className="text-foreground">{selectedClient.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Senha</Label>
                    <div className="flex items-center gap-2">
                      <code className="bg-accent px-2 py-1 rounded text-sm font-mono">
                        {selectedClient.password}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyPassword(selectedClient.password)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">CPF</Label>
                    <p className="text-foreground">{selectedClient.cpf || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                    <p className="text-foreground">{selectedClient.phone || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-foreground">{selectedClient.email || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                    <p className="text-foreground">{selectedClient.address || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pets</h3>
                {getClientPets(selectedClient.id).length > 0 ? (
                  <div className="space-y-3">
                    {getClientPets(selectedClient.id).map((pet) => (
                      <div key={pet.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                            <p className="font-medium">{pet.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Idade</Label>
                            <p>{pet.age || '-'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Raça</Label>
                            <p>{pet.breed || '-'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Espécie</Label>
                            <p>{pet.species || '-'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Sexo</Label>
                            <p>{pet.sex || '-'}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Peso</Label>
                            <p>{pet.weight ? `${pet.weight}kg` : '-'}</p>
                          </div>
                          {pet.birth_date && (
                            <div className="col-span-2">
                              <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
                              <p>{new Date(pet.birth_date).toLocaleDateString('pt-BR')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum pet cadastrado</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Dados do Tutor */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Dados do Tutor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Nome Completo *</Label>
                  <Input
                    id="editName"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCpf">CPF</Label>
                  <Input
                    id="editCpf"
                    value={editFormData.cpf}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, cpf: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAddress">Endereço</Label>
                <Input
                  id="editAddress"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Telefone</Label>
                  <Input
                    id="editPhone"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Pets Existentes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Pets Existentes</h3>
              {selectedClient && getClientPets(selectedClient.id).length > 0 ? (
                <div className="space-y-2">
                  {getClientPets(selectedClient.id).map((pet) => (
                    <div key={pet.id} className="flex items-center justify-between bg-accent/30 rounded-lg p-3">
                      <div>
                        <p className="font-medium">{pet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pet.breed} • {pet.species} • {pet.sex}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePet(pet.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum pet cadastrado</p>
              )}
            </div>

            {/* Adicionar Novos Pets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Adicionar Novos Pets</h3>
                <Button type="button" variant="outline" onClick={addNewPet}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Pet
                </Button>
              </div>
              
              {editFormData.newPets.map((pet, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Novo Pet {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNewPet(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Pet *</Label>
                      <Input
                        value={pet.name}
                        onChange={(e) => {
                          const newPets = [...editFormData.newPets];
                          newPets[index].name = e.target.value;
                          setEditFormData(prev => ({ ...prev, newPets }));
                        }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Idade</Label>
                      <Input
                        value={pet.age}
                        onChange={(e) => {
                          const newPets = [...editFormData.newPets];
                          newPets[index].age = e.target.value;
                          setEditFormData(prev => ({ ...prev, newPets }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Nascimento</Label>
                      <Input
                        type="date"
                        value={pet.birth_date}
                        onChange={(e) => {
                          const newPets = [...editFormData.newPets];
                          newPets[index].birth_date = e.target.value;
                          setEditFormData(prev => ({ ...prev, newPets }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Peso (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={pet.weight}
                        onChange={(e) => {
                          const newPets = [...editFormData.newPets];
                          newPets[index].weight = e.target.value;
                          setEditFormData(prev => ({ ...prev, newPets }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Raça</Label>
                      <Input
                        value={pet.breed}
                        onChange={(e) => {
                          const newPets = [...editFormData.newPets];
                          newPets[index].breed = e.target.value;
                          setEditFormData(prev => ({ ...prev, newPets }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Espécie</Label>
                      <Select
                        value={pet.species}
                        onValueChange={(value) => {
                          const newPets = [...editFormData.newPets];
                          newPets[index].species = value;
                          setEditFormData(prev => ({ ...prev, newPets }));
                        }}
                      >
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
                    <div className="space-y-2 col-span-2">
                      <Label>Sexo</Label>
                      <Select
                        value={pet.sex}
                        onValueChange={(value) => {
                          const newPets = [...editFormData.newPets];
                          newPets[index].sex = value;
                          setEditFormData(prev => ({ ...prev, newPets }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Macho">Macho</SelectItem>
                          <SelectItem value="Fêmea">Fêmea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
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
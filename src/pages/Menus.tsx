import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useClients } from "@/hooks/useClients";
import { useMenus } from "@/hooks/useMenus";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Filter, 
  Utensils, 
  User,
  Heart,
  FileText,
  Upload,
  Eye,
  Edit,
  Trash2,
  Printer
} from "lucide-react";

// Menu View Dialog Component
function MenuViewDialog({ menu, clientName }: { menu: any; clientName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Visualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            {menu.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Cliente</h3>
              <p className="text-muted-foreground">{clientName}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Status</h3>
              <Badge variant="outline" className={menu.is_active ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
                {menu.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Quantidade Diária</h3>
              <p className="text-muted-foreground">{menu.daily_food_amount}g</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Refeições por Dia</h3>
              <p className="text-muted-foreground">{menu.meals_per_day}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Ingredientes</h3>
            <div className="space-y-2">
              {menu.ingredients.map((ingredient: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                  <span className="font-medium">{ingredient.name}</span>
                  <span className="text-muted-foreground">{ingredient.quantity}{ingredient.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {menu.special_notes && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Observações Especiais</h3>
              <p className="text-muted-foreground bg-accent/20 p-3 rounded-lg">{menu.special_notes}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Informações</h3>
            <div className="text-sm text-muted-foreground">
              <p>Criado em: {new Date(menu.created_at).toLocaleDateString('pt-BR')}</p>
              <p>Última atualização: {new Date(menu.updated_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Menus() {
  const { clients } = useClients();
  const { menus, loading, createMenu, updateMenu, deleteMenu, printMenu } = useMenus();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    daily_food_amount: '',
    meals_per_day: '2',
    ingredients: [{ name: '', quantity: '', unit: 'g' }],
    special_notes: '',
    is_active: true,
    recipe_file: null as File | null
  });

  const resetForm = () => {
    setFormData({
      name: '',
      client_id: '',
      daily_food_amount: '',
      meals_per_day: '2',
      ingredients: [{ name: '', quantity: '', unit: 'g' }],
      special_notes: '',
      is_active: true,
      recipe_file: null
    });
    setEditingMenu(null);
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: 'g' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const menuData = {
      name: formData.name,
      client_id: formData.client_id,
      daily_food_amount: parseFloat(formData.daily_food_amount) || 0,
      meals_per_day: parseInt(formData.meals_per_day) || 2,
      ingredients: formData.ingredients,
    special_notes: formData.special_notes,
    is_active: formData.is_active
    };

    try {
      if (editingMenu) {
        await updateMenu(editingMenu.id, menuData);
      } else {
        await createMenu(menuData);
      }
      
      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  };

  const handleEdit = (menu: any) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      client_id: menu.client_id,
      daily_food_amount: menu.daily_food_amount?.toString() || '',
      meals_per_day: menu.meals_per_day?.toString() || '2',
      ingredients: menu.ingredients || [{ name: '', quantity: '', unit: 'g' }],
      special_notes: menu.special_notes || '',
      is_active: menu.is_active ?? true,
      recipe_file: null
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este cardápio?")) {
      await deleteMenu(id);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : "Cliente não encontrado";
  };

  const filteredMenus = menus.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(menu.client_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cardápios Personalizados</h1>
          <p className="text-muted-foreground mt-1">
            Dietas específicas para cada pet
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Cardápio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMenu ? "Editar Cardápio" : "Novo Cardápio"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Cardápio *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select value={formData.client_id} onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.pet_name && `(${client.pet_name})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="daily-amount">Quantidade Diária (g) *</Label>
                  <Input
                    id="daily-amount"
                    type="number"
                    value={formData.daily_food_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, daily_food_amount: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meals">Refeições por Dia</Label>
                  <Select value={formData.meals_per_day} onValueChange={(value) => setFormData(prev => ({ ...prev, meals_per_day: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 refeição</SelectItem>
                      <SelectItem value="2">2 refeições</SelectItem>
                      <SelectItem value="3">3 refeições</SelectItem>
                      <SelectItem value="4">4 refeições</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ingredientes</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Nome do ingrediente"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Quantidade"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Select value={ingredient.unit} onValueChange={(value) => updateIngredient(index, 'unit', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="unidades">un</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        disabled={formData.ingredients.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações Especiais</Label>
                <Textarea
                  id="notes"
                  value={formData.special_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_notes: e.target.value }))}
                  placeholder="Alergias, preferências, instruções especiais..."
                />
              </div>

                  <div className="space-y-2">
                    <Label>Upload da Receita (opcional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Clique para fazer upload ou arraste um arquivo PDF/imagem
                      </p>
                      <input 
                        type="file" 
                        className="w-full p-2 border border-border rounded-lg cursor-pointer" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({ ...prev, recipe_file: file }));
                          }
                        }}
                      />
                      {formData.recipe_file && (
                        <p className="text-sm text-green-600 mt-2">
                          Arquivo selecionado: {formData.recipe_file.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center justify-between">
                      <span>Status do Cardápio</span>
                      <Switch 
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.is_active ? "Cardápio ativo e disponível" : "Cardápio inativo"}
                    </p>
                  </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
                >
                  {editingMenu ? "Atualizar" : "Criar"} Cardápio
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por cardápio ou cliente..." 
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

      {/* Menus Grid */}
      <div className="grid gap-4">
        {filteredMenus.length === 0 ? (
          <Card className="shadow-card-hover border-border/50">
            <CardContent className="p-8 text-center">
              <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? "Nenhum cardápio encontrado" : "Nenhum cardápio cadastrado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Nenhum cardápio corresponde aos critérios de busca." 
                  : "Comece criando cardápios personalizados para seus clientes."
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => { resetForm(); setShowDialog(true); }}
                  className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cardápio
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredMenus.map((menu) => (
            <Card key={menu.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-primary" />
                      {menu.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {getClientName(menu.client_id)}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={menu.is_active ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}
                  >
                    {menu.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Alimentação Diária</div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-primary">{menu.daily_food_amount}g</p>
                      <p className="text-xs text-muted-foreground">
                        {menu.meals_per_day} refeição(ões) por dia
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Ingredientes</div>
                    <div className="space-y-1">
                      {menu.ingredients.slice(0, 3).map((ing: any, index: number) => (
                        <p key={index} className="text-xs text-foreground">
                          {ing.name} - {ing.quantity}{ing.unit}
                        </p>
                      ))}
                      {menu.ingredients.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{menu.ingredients.length - 3} mais...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Informações</div>
                    <div className="space-y-1">
                      <p className="text-xs text-foreground">
                        Criado: {new Date(menu.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      {menu.special_notes && (
                        <p className="text-xs text-muted-foreground">
                          Observações especiais
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <MenuViewDialog menu={menu} clientName={getClientName(menu.client_id)} />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(menu)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => printMenu(menu)}
                    className="flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(menu.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
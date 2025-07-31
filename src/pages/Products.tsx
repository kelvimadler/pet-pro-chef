import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/useProducts";
import { 
  Plus, 
  Search, 
  Package2, 
  Edit,
  Calendar,
  Info,
  ShoppingBag,
  BarChart3,
  Hash,
  RefreshCw
} from "lucide-react";
import { useWooCommerce } from "@/hooks/useWooCommerce";
import { Switch } from "@/components/ui/switch";

export default function Products() {
  const { products, loading, createProduct, updateProduct, updateStock } = useProducts();
  const { syncStockToWooCommerce, getStockFromWooCommerce, isConfigured } = useWooCommerce();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    validity_days: '60',
    package_sizes: '60,150',
    sku: '',
    stock_quantity: '0',
    manage_stock: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      validity_days: '60',
      package_sizes: '60,150',
      sku: '',
      stock_quantity: '0',
      manage_stock: true
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description || null,
      validity_days: parseInt(formData.validity_days) || 60,
      package_sizes: formData.package_sizes
        .split(',')
        .map(size => parseInt(size.trim()))
        .filter(size => !isNaN(size)),
      sku: formData.sku || null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      manage_stock: formData.manage_stock
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
      
      // Sync stock with WooCommerce if product has SKU and stock changed
      if (result && productData.sku && isConfigured && productData.manage_stock) {
        const oldStock = editingProduct.stock_quantity || 0;
        const newStock = productData.stock_quantity;
        if (oldStock !== newStock) {
          try {
            await syncStockToWooCommerce(productData.sku, newStock);
          } catch (error) {
            console.error('Failed to sync stock with WooCommerce:', error);
          }
        }
      }
    } else {
      result = await createProduct(productData);
      
      // Sync initial stock with WooCommerce for new products
      if (result && productData.sku && isConfigured && productData.manage_stock) {
        try {
          await syncStockToWooCommerce(productData.sku, productData.stock_quantity);
        } catch (error) {
          console.error('Failed to sync initial stock with WooCommerce:', error);
        }
      }
    }
    
    setShowDialog(false);
    resetForm();
  };

  const handleStockUpdate = async (product: any, newStock: number) => {
    const result = await updateStock(product.id, newStock);
    
    // Sync with WooCommerce if product has SKU
    if (result && product.sku && isConfigured && product.manage_stock) {
      try {
        await syncStockToWooCommerce(product.sku, newStock);
      } catch (error) {
        console.error('Failed to sync stock with WooCommerce:', error);
      }
    }
    
    return result;
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      validity_days: product.validity_days?.toString() || '60',
      package_sizes: product.package_sizes?.join(', ') || '60, 150',
      sku: product.sku || '',
      stock_quantity: product.stock_quantity?.toString() || '0',
      manage_stock: product.manage_stock ?? true
    });
    setShowDialog(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-3xl font-bold text-foreground">Gestão de Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os produtos finais da sua produção
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Snacks de Frango Natural"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição detalhada do produto..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validity-days">Validade (dias) *</Label>
                  <Input
                    id="validity-days"
                    type="number"
                    min="1"
                    value={formData.validity_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, validity_days: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package-sizes">Tamanhos de Embalagem (g) *</Label>
                  <Input
                    id="package-sizes"
                    value={formData.package_sizes}
                    onChange={(e) => setFormData(prev => ({ ...prev, package_sizes: e.target.value }))}
                    placeholder="60, 150, 300"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Separe os tamanhos por vírgula
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (WooCommerce)</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="PROD-001"
                  />
                  <p className="text-xs text-muted-foreground">
                    Código único para sincronização
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-quantity">Estoque Inicial</Label>
                  <Input
                    id="stock-quantity"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="manage-stock">Gerenciar Estoque</Label>
                  <Switch
                    id="manage-stock"
                    checked={formData.manage_stock}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, manage_stock: checked }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Ativar controle de estoque para este produto
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
                  {editingProduct ? "Atualizar" : "Criar"} Produto
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
              placeholder="Buscar produtos..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <Card className="shadow-card-hover border-border/50">
            <CardContent className="p-8 text-center">
              <Package2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Nenhum produto corresponde aos critérios de busca." 
                  : "Comece adicionando seus primeiros produtos para organizar suas produções."
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => { resetForm(); setShowDialog(true); }}
                  className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      <Package2 className="w-5 h-5 text-primary" />
                      {product.name}
                    </CardTitle>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Validade
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {product.validity_days} dias
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      Tamanhos de Embalagem
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.package_sizes?.map((size: number, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {size}g
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      Estoque
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={product.stock_quantity || 0}
                          onChange={(e) => {
                            const newStock = parseInt(e.target.value) || 0;
                            handleStockUpdate(product, newStock);
                          }}
                          className="w-20 h-8 text-sm"
                        />
                        <span className="text-sm text-muted-foreground">un.</span>
                      </div>
                      {product.sku && (
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{product.sku}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      Informações
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Criado em:</span>
                        <span className="font-medium text-foreground">
                          {new Date(product.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Atualizado:</span>
                        <span className="font-medium text-foreground">
                          {new Date(product.updated_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 flex items-center gap-2"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  {product.sku && isConfigured && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={async () => {
                        try {
                          const wooStock = await getStockFromWooCommerce(product.sku);
                          await updateStock(product.id, wooStock);
                        } catch (error) {
                          console.error('Sync failed:', error);
                        }
                      }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Sync
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
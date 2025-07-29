import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSanitaryLabels, CreateSanitaryLabelData } from "@/hooks/useSanitaryLabels";
import { 
  QrCode, 
  Calendar, 
  AlertTriangle,
  Printer,
  Search,
  Plus,
  Trash2,
  Thermometer
} from "lucide-react";
import { format } from "date-fns";

export default function SanitaryLabels() {
  const { labels, loading, createLabel, printLabel, deleteLabel } = useSanitaryLabels();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateSanitaryLabelData>({
    product_name: "",
    expiry_datetime: "",
    original_expiry_date: "",
    conservation_type: "Resfriado",
    observations: ""
  });

  const filteredLabels = labels.filter(label =>
    label.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLabel(formData);
      setFormData({
        product_name: "",
        expiry_datetime: "",
        original_expiry_date: "",
        conservation_type: "Resfriado",
        observations: ""
      });
      setShowForm(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getStatusInfo = (expiryDatetime: string) => {
    const now = new Date();
    const expiry = new Date(expiryDatetime);
    const hoursUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilExpiry < 0) {
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Vencido",
        urgency: "high"
      };
    } else if (hoursUntilExpiry <= 4) {
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

  const getTimeUntilExpiry = (expiryDatetime: string) => {
    const now = new Date();
    const expiry = new Date(expiryDatetime);
    const hours = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hours < 0) return "Vencido";
    if (hours < 1) return "Vence em menos de 1h";
    if (hours < 24) return `${hours}h restantes`;
    const days = Math.ceil(hours / 24);
    return `${days} dia${days > 1 ? 's' : ''}`;
  };

  const getConservationIcon = (type: string) => {
    switch (type) {
      case 'Congelado': return '❄️';
      case 'Resfriado': return '🧊';
      case 'Seco': return '📦';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando etiquetas sanitárias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Etiquetas Sanitárias</h1>
          <p className="text-muted-foreground mt-1">
            Controle de validade para produtos da geladeira
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Etiqueta
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="shadow-card-hover border-border/50">
          <CardHeader>
            <CardTitle>Gerar Nova Etiqueta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">Produto</Label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                    placeholder="Nome do produto"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conservation_type">Conservação</Label>
                  <Select 
                    value={formData.conservation_type} 
                    onValueChange={(value: 'Congelado' | 'Resfriado' | 'Seco') => 
                      setFormData(prev => ({ ...prev, conservation_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Congelado">❄️ Congelado</SelectItem>
                      <SelectItem value="Resfriado">🧊 Resfriado</SelectItem>
                      <SelectItem value="Seco">📦 Seco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry_datetime">Validade (Data e Hora)</Label>
                  <Input
                    id="expiry_datetime"
                    type="datetime-local"
                    value={formData.expiry_datetime}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiry_datetime: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original_expiry_date">Validade Original</Label>
                  <Input
                    id="original_expiry_date"
                    type="date"
                    value={formData.original_expiry_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, original_expiry_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observação (opcional)</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Observações adicionais"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Criar Etiqueta</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="shadow-card-hover border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por produto..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Labels List */}
      <div className="grid gap-4">
        {filteredLabels.length === 0 ? (
          <Card className="shadow-card-hover border-border/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhuma etiqueta encontrada para a busca." : "Nenhuma etiqueta cadastrada ainda."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLabels.map((label) => {
            const statusInfo = getStatusInfo(label.expiry_datetime);
            const timeInfo = getTimeUntilExpiry(label.expiry_datetime);

            return (
              <Card key={label.id} className="shadow-card-hover border-border/50 hover:shadow-elegant transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-foreground flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-primary" />
                        {label.product_name}
                        <span className="text-lg">{getConservationIcon(label.conservation_type)}</span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {label.conservation_type} {label.printed && '• Impressa'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteLabel(label.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
                          <span className="text-muted-foreground">Validade:</span>
                          <span className="font-medium text-foreground">
                            {format(new Date(label.expiry_datetime), "dd/MM/yyyy HH:mm")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Original:</span>
                          <span className="font-medium text-foreground">
                            {format(new Date(label.original_expiry_date), "dd/MM/yyyy")}
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
                          {timeInfo}
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
                          onClick={() => printLabel(label.id)}
                          disabled={label.printed}
                        >
                          <Printer className="w-4 h-4" />
                          {label.printed ? "Impressa" : "Imprimir"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {label.observations && (
                    <div className="border-t border-border/50 pt-4">
                      <div className="text-sm text-muted-foreground mb-2">Observações:</div>
                      <p className="text-sm text-foreground bg-accent/20 p-3 rounded-lg">
                        {label.observations}
                      </p>
                    </div>
                  )}

                  {/* Thermal Label Preview */}
                  <div className="border-t border-border/50 pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Preview da Etiqueta Térmica:</div>
                    <div className="bg-white border border-border rounded-lg p-3 max-w-xs">
                      <div className="text-center space-y-1">
                        <h4 className="font-bold text-sm text-gray-900">{label.product_name}</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="flex items-center justify-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            {label.conservation_type}
                          </p>
                          <p>Validade: {format(new Date(label.expiry_datetime), "dd/MM/yyyy HH:mm")}</p>
                          <p>Original: {format(new Date(label.original_expiry_date), "dd/MM/yyyy")}</p>
                          {label.observations && (
                            <p className="text-xs bg-gray-100 p-1 rounded">
                              {label.observations}
                            </p>
                          )}
                        </div>
                        <div className="bg-gray-100 h-6 flex items-center justify-center">
                          <QrCode className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
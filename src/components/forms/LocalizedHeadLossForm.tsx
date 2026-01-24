import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Removendo TabsContent
import { Componente } from "@/lib/api";
import { FormComponentItem, FormPipeSection } from "@/pages/Index";
import { MobileHelpDrawer } from "@/components/MobileHelpDrawer";
import { cn } from "@/lib/utils";

interface LocalizedHeadLossFormProps {
  section: FormPipeSection;
  materials: Componente[];
  onChange: (field: keyof FormPipeSection, value: any) => void;
  parentId: string;
}

export const LocalizedHeadLossForm = ({
  section,
  materials,
  onChange,
  parentId,
}: LocalizedHeadLossFormProps) => {
  const uniqueIdPrefix = `${parentId}-loss`;

  const handleLossModeChange = (value: string) => {
    // Atualiza APENAS o lossMode
    // A limpeza de componentes/k_manual será feita no momento do cálculo
    onChange("lossMode", value as 'detailed' | 'manual');
  };

  const handleManualKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onChange("k_manual", "");
    } else {
      const parsedValue = parseFloat(value);
      onChange("k_manual", isNaN(parsedValue) ? "" : parsedValue);
    }
  };

  const addComponent = () => {
    // Find the first available component ID
    const defaultComponentId = materials[0]?.id || "";
    if (!defaultComponentId) return;

    const newComponent: FormComponentItem = {
      id: defaultComponentId,
      count: 1,
    };
    onChange("componentes", [...(section.componentes || []), newComponent]);
  };

  const updateComponent = (index: number, field: keyof FormComponentItem, value: any) => {
    const newComponents = [...(section.componentes || [])];
    newComponents[index] = { ...newComponents[index], [field]: value };
    onChange("componentes", newComponents);
  };

  const removeComponent = (index: number) => {
    const newComponents = (section.componentes || []).filter((_, i) => i !== index);
    onChange("componentes", newComponents);
  };

  // Helper function to display value: show "" if value is 0 or null/undefined
  const displayValue = (val: number | string | undefined) => 
    val === 0 || val === undefined || val === "" ? "" : val;

  // Group components by category for better display
  const groupedComponents = materials.reduce((acc, component) => {
    const category = component.categoria || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, Componente[]>);

  // Garante que o valor é 'detailed' ou 'manual'
  const currentLossMode = section.lossMode === 'detailed' || section.lossMode === 'manual' 
    ? section.lossMode 
    : 'detailed';


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="font-semibold">Perda de Carga Localizada</Label>
        <MobileHelpDrawer title="Perda de Carga Localizada">
          <p className="font-semibold mb-1">Perda de Carga Localizada (HL)</p>
          <p className="text-sm">
            Defina as perdas de carga causadas por conexões, válvulas e acessórios. Você pode usar a lista detalhada de componentes (método K) ou inserir o coeficiente K total manualmente.
          </p>
        </MobileHelpDrawer>
      </div>

      <Tabs 
        value={currentLossMode} 
        onValueChange={handleLossModeChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detailed">Lista Detalhada (K)</TabsTrigger>
          <TabsTrigger value="manual">K Manual</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Conteúdo renderizado condicionalmente */}
      <div className="space-y-4 pt-4">
        {currentLossMode === 'detailed' && (
          <>
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-muted-foreground">
                Componentes Adicionados ({section.componentes?.length || 0})
              </h4>
              <Button
                onClick={addComponent}
                size="sm"
                variant="outline"
                className="gap-2"
                disabled={materials.length === 0}
              >
                <Plus className="h-4 w-4" />
                Adicionar Item
              </Button>
            </div>

            {section.componentes && section.componentes.length > 0 ? (
              <div className="space-y-3">
                {section.componentes.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex-1">
                      <Label htmlFor={`${uniqueIdPrefix}-comp-${index}`}>Componente</Label>
                      <Select
                        value={item.id}
                        onValueChange={(value) => updateComponent(index, "id", value)}
                      >
                        <SelectTrigger id={`${uniqueIdPrefix}-comp-${index}`} className="mt-1">
                          <SelectValue placeholder="Selecione o componente" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(groupedComponents).map(([category, comps]) => (
                            <div key={category}>
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                                {category}
                              </div>
                              {comps.map((comp) => (
                                <SelectItem key={comp.id} value={comp.id}>
                                  {comp.nome} (K={comp.k})
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <Label htmlFor={`${uniqueIdPrefix}-count-${index}`}>Qtd.</Label>
                      <Input
                        id={`${uniqueIdPrefix}-count-${index}`}
                        type="number"
                        step="1"
                        min="1"
                        value={item.count}
                        onChange={(e) => updateComponent(index, "count", parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeComponent(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
                Nenhum componente adicionado.
              </p>
            )}
          </>
        )}

        {currentLossMode === 'manual' && (
          <div>
            <Label htmlFor={`${uniqueIdPrefix}-k-manual`}>
              Coeficiente K Total (Manual)
            </Label>
            <Input
              id={`${uniqueIdPrefix}-k-manual`}
              type="number"
              step="0.01"
              min="0"
              value={displayValue(section.k_manual)}
              onChange={handleManualKChange}
              placeholder="Ex: 2.5"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use esta opção se você já calculou o coeficiente K total para este trecho.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
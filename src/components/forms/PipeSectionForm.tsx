import { Trash2, HelpCircle } from "lucide-react";
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
import { Material, PipeSection } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MobileHelpDrawer } from "@/components/MobileHelpDrawer";

interface PipeSectionFormProps {
  section: PipeSection;
  index: number;
  materials: Material[];
  onChange: (index: number, field: keyof PipeSection, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  parentId: string; // Novo: ID único do sistema pai (sucção/recalque)
}

export const PipeSectionForm = ({
  section,
  index,
  materials,
  onChange,
  onRemove,
  canRemove,
  parentId,
}: PipeSectionFormProps) => {
  const selectedMaterial = Array.isArray(materials) 
    ? materials.find((m) => m.id === section.material)
    : undefined;

  // Helper function to handle number input changes
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof PipeSection,
    isInteger = false
  ) => {
    const value = e.target.value;
    if (value === "") {
      onChange(index, field, ""); // Keep as empty string in state if input is empty
    } else {
      const parsedValue = isInteger ? parseInt(value) : parseFloat(value);
      onChange(index, field, isNaN(parsedValue) ? "" : parsedValue);
    }
  };

  // Helper function to display value: show "" if value is 0 or null/undefined
  const displayValue = (val: number | string | undefined) => 
    val === 0 || val === undefined || val === "" ? "" : val;

  // ID único para este trecho
  const uniqueId = `${parentId}-trecho-${index}`;

  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-card-foreground">
          Trecho {index + 1}
        </h4>
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${uniqueId}-L`}>Comprimento (m)</Label>
          <Input
            id={`${uniqueId}-L`}
            type="number"
            step="0.1"
            min="0"
            value={displayValue(section.L)}
            onChange={(e) => handleNumberChange(e, "L")}
            placeholder="0"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor={`${uniqueId}-D`}>Diâmetro (mm)</Label>
          <Input
            id={`${uniqueId}-D`}
            type="number"
            step="0.1"
            min="0"
            value={displayValue(section.D)}
            onChange={(e) => handleNumberChange(e, "D")}
            placeholder="0"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor={`${uniqueId}-material`}>Material</Label>
          <Select
            value={section.material}
            onValueChange={(value) => onChange(index, "material", value)}
          >
            <SelectTrigger id={`${uniqueId}-material`} className="mt-1">
              <SelectValue placeholder="Selecione o material" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(materials) && materials.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`${uniqueId}-rugosidade`}>
            Rugosidade (mm) {selectedMaterial && `(padrão: ${selectedMaterial.rugosidade_mm})`}
          </Label>
          <Input
            id={`${uniqueId}-rugosidade`}
            type="number"
            step="0.001"
            min="0"
            value={displayValue(section.rugosidade_mm)}
            onChange={(e) => handleNumberChange(e, "rugosidade_mm")}
            placeholder="Opcional"
            className="mt-1"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`${uniqueId}-conexoes`}>
              Conexões (equiv. cotovelos 90°)
            </Label>
            <MobileHelpDrawer title="Conexões Equivalentes">
              <p className="font-semibold mb-1">Conexões Equivalentes</p>
              <p className="text-sm">
                Este valor representa a soma de todas as singularidades (válvulas, curvas, tês, etc.) presentes neste trecho, convertidas em número equivalente de cotovelos de 90°.
              </p>
              <p className="text-sm mt-2">
                <strong>Exemplo:</strong> 1 Válvula de Gaveta (equiv. 12 cotovelos) + 2 Curvas de 45° (equiv. 0.5 cotovelo cada) = 13 cotovelos equivalentes.
              </p>
            </MobileHelpDrawer>
          </div>
          <Input
            id={`${uniqueId}-conexoes`}
            type="number"
            step="1"
            min="0"
            value={displayValue(section.conexoes)}
            onChange={(e) => handleNumberChange(e, "conexoes", true)}
            placeholder="0"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
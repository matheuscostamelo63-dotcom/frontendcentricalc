import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DischargeSystem, Material, PipeSection, Componente } from "@/lib/api";
import { PipeSectionForm } from "./PipeSectionForm";
import { useState } from "react";
import { FormPipeSection } from "@/pages/Index"; // Importando o tipo de seção do formulário

interface DischargeSystemFormProps {
  system: DischargeSystem;
  index: number;
  materials: Material[];
  components: Componente[]; // Novo: Lista de componentes
  onChange: (index: number, field: keyof DischargeSystem, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const DischargeSystemForm = ({
  system,
  index,
  materials,
  components,
  onChange,
  onRemove,
  canRemove,
}: DischargeSystemFormProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSectionChange = (
    sectionIndex: number,
    field: keyof FormPipeSection, // Usando o tipo de campo do formulário
    value: any
  ) => {
    console.log("🟢 handleSectionChange (Discharge):", sectionIndex, field, value); // DEBUG
    const newSections = [...system.trechos];
    newSections[sectionIndex] = { ...newSections[sectionIndex], [field]: value };
    onChange(index, "trechos", newSections);
  };

  const addSection = () => {
    const newSection: FormPipeSection = {
      L: 0,
      D: 0,
      material: materials[0]?.id || "",
      componentes: [],
      lossMode: 'detailed', // Garantindo que o modo inicial seja 'detailed'
    };
    onChange(index, "trechos", [...system.trechos, newSection]);
  };

  const removeSection = (sectionIndex: number) => {
    const newSections = system.trechos.filter((_, i) => i !== sectionIndex);
    onChange(index, "trechos", newSections);
  };

  // Helper function to display value: show "" if value is 0 or null/undefined
  const displayValue = (val: number | string | undefined) => 
    val === 0 || val === undefined || val === "" ? "" : val;

  // Helper function to handle number input changes for the system
  const handleSystemNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof DischargeSystem
  ) => {
    const value = e.target.value;
    if (value === "") {
      onChange(index, field, "");
    } else {
      const parsedValue = parseFloat(value);
      onChange(index, field, isNaN(parsedValue) ? "" : parsedValue);
    }
  };

  // Custom handler for pressure (Pa to bar conversion)
  const handlePressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onChange(index, "pressao_manometrica", ""); // Store "" if input is empty
    } else {
      const parsedValue = parseFloat(value);
      // Convert bar to Pa for storage
      onChange(index, "pressao_manometrica", isNaN(parsedValue) ? "" : parsedValue * 100000);
    }
  };

  // Custom display for pressure (Pa to bar conversion)
  const displayPressure = (pa: number | string | undefined) => {
    if (pa === 0 || pa === undefined || pa === "") return "";
    // Return the raw converted value as a string, without fixed decimals
    return String(Number(pa) / 100000);
  };

  // Unique ID prefix for this system
  const systemIdPrefix = `rec-${index}`;

  return (
    <div className="border-2 border-accent/30 rounded-lg p-6 space-y-4 bg-card">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Destino de Recalque {index + 1}
            </h3>
            <p className="text-sm text-muted-foreground">{system.destino_id}</p>
          </div>
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <>
          <div>
            <Label htmlFor={`${systemIdPrefix}-id`}>Nome do Destino</Label>
            <Input
              id={`${systemIdPrefix}-id`}
              value={system.destino_id}
              onChange={(e) => onChange(index, "destino_id", e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Tipo de Reservatório</Label>
            <RadioGroup
              value={system.tipo_reservatorio}
              onValueChange={(value: "aberto" | "pressurizado") =>
                onChange(index, "tipo_reservatorio", value)
              }
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aberto" id={`${systemIdPrefix}-aberto`} />
                <Label htmlFor={`${systemIdPrefix}-aberto`}>Aberto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="pressurizado"
                  id={`${systemIdPrefix}-pressurizado`}
                />
                <Label htmlFor={`${systemIdPrefix}-pressurizado`}>
                  Pressurizado
                </Label>
              </div>
            </RadioGroup>
          </div>

          {system.tipo_reservatorio === "pressurizado" && (
            <div>
              <Label htmlFor={`${systemIdPrefix}-pressao`}>
                Pressão Manométrica (bar)
              </Label>
              <Input
                id={`${systemIdPrefix}-pressao`}
                type="number"
                step="0.1"
                min="0"
                value={displayPressure(system.pressao_manometrica)}
                onChange={handlePressureChange}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`${systemIdPrefix}-H-nominal`}>
                Desnível Geométrico Nominal (m)
              </Label>
              <Input
                id={`${systemIdPrefix}-H-nominal`}
                type="number"
                step="0.1"
                value={displayValue(system.nivel_nominal)}
                onChange={(e) => handleSystemNumberChange(e, "nivel_nominal")}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`${systemIdPrefix}-H-min`}>Desnível Geométrico Mínimo (m)</Label>
              <Input
                id={`${systemIdPrefix}-H-min`}
                type="number"
                step="0.1"
                value={displayValue(system.nivel_min)}
                onChange={(e) => handleSystemNumberChange(e, "nivel_min")}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`${systemIdPrefix}-H-max`}>Desnível Geométrico Máximo (m)</Label>
              <Input
                id={`${systemIdPrefix}-H-max`}
                type="number"
                step="0.1"
                value={displayValue(system.nivel_max)}
                onChange={(e) => handleSystemNumberChange(e, "nivel_max")}
                placeholder="0"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-card-foreground">
                Trechos de Tubulação
              </h4>
              <Button
                onClick={addSection}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Trecho
              </Button>
            </div>

            {system.trechos.map((section, sectionIndex) => (
              <PipeSectionForm
                key={sectionIndex}
                section={section as FormPipeSection}
                index={sectionIndex}
                materials={materials}
                components={components} // Passando componentes
                onChange={handleSectionChange}
                onRemove={removeSection}
                canRemove={system.trechos.length > 1}
                parentId={systemIdPrefix} // Passando o ID único do pai
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
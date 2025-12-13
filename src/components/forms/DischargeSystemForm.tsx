import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DischargeSystem, Material, PipeSection } from "@/lib/api";
import { PipeSectionForm } from "./PipeSectionForm";
import { useState } from "react";

interface DischargeSystemFormProps {
  system: DischargeSystem;
  index: number;
  materials: Material[];
  onChange: (index: number, field: keyof DischargeSystem, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export const DischargeSystemForm = ({
  system,
  index,
  materials,
  onChange,
  onRemove,
  canRemove,
}: DischargeSystemFormProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSectionChange = (
    sectionIndex: number,
    field: keyof PipeSection,
    value: any
  ) => {
    const newSections = [...system.trechos];
    newSections[sectionIndex] = { ...newSections[sectionIndex], [field]: value };
    onChange(index, "trechos", newSections);
  };

  const addSection = () => {
    const newSection: PipeSection = {
      L: 0,
      D: 0,
      material: materials[0]?.id || "",
      conexoes: 0,
    };
    onChange(index, "trechos", [...system.trechos, newSection]);
  };

  const removeSection = (sectionIndex: number) => {
    const newSections = system.trechos.filter((_, i) => i !== sectionIndex);
    onChange(index, "trechos", newSections);
  };

  // Helper function to display value: show "" if value is 0 or null/undefined
  const displayValue = (val: number | string | undefined) => 
    val === 0 || val === undefined ? "" : val;

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
            <Label htmlFor={`destino-id-${index}`}>Nome do Destino</Label>
            <Input
              id={`destino-id-${index}`}
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
                <RadioGroupItem value="aberto" id={`rec-aberto-${index}`} />
                <Label htmlFor={`rec-aberto-${index}`}>Aberto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="pressurizado"
                  id={`rec-pressurizado-${index}`}
                />
                <Label htmlFor={`rec-pressurizado-${index}`}>
                  Pressurizado
                </Label>
              </div>
            </RadioGroup>
          </div>

          {system.tipo_reservatorio === "pressurizado" && (
            <div>
              <Label htmlFor={`rec-pressao-${index}`}>
                Pressão Manométrica (bar)
              </Label>
              <Input
                id={`rec-pressao-${index}`}
                type="number"
                step="0.1"
                min="0"
                value={
                  system.pressao_manometrica
                    ? (system.pressao_manometrica / 100000).toFixed(2)
                    : ""
                }
                onChange={(e) =>
                  onChange(
                    index,
                    "pressao_manometrica",
                    parseFloat(e.target.value) * 100000 || 0
                  )
                }
                className="mt-1"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`rec-H-nominal-${index}`}>
                Desnível Geométrico Nominal (m)
              </Label>
              <Input
                id={`rec-H-nominal-${index}`}
                type="number"
                step="0.1"
                value={displayValue(system.nivel_nominal)}
                onChange={(e) => handleSystemNumberChange(e, "nivel_nominal")}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`rec-H-min-${index}`}>Desnível Geométrico Mínimo (m)</Label>
              <Input
                id={`rec-H-min-${index}`}
                type="number"
                step="0.1"
                value={displayValue(system.nivel_min)}
                onChange={(e) => handleSystemNumberChange(e, "nivel_min")}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`rec-H-max-${index}`}>Desnível Geométrico Máximo (m)</Label>
              <Input
                id={`rec-H-max-${index}`}
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
                section={section}
                index={sectionIndex}
                materials={materials}
                onChange={handleSectionChange}
                onRemove={removeSection}
                canRemove={system.trechos.length > 1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
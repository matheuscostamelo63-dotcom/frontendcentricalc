import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Material, PipeSection, SuctionSystem } from "@/lib/api";
import { PipeSectionForm } from "./PipeSectionForm";

interface SuctionSystemFormProps {
  system: SuctionSystem;
  materials: Material[];
  onChange: (field: keyof SuctionSystem, value: any) => void;
}

export const SuctionSystemForm = ({
  system,
  materials,
  onChange,
}: SuctionSystemFormProps) => {
  const handleSectionChange = (
    index: number,
    field: keyof PipeSection,
    value: any
  ) => {
    const newSections = [...system.trechos];
    newSections[index] = { ...newSections[index], [field]: value };
    onChange("trechos", newSections);
  };

  const addSection = () => {
    const newSection: PipeSection = {
      L: 0,
      D: 0,
      material: materials[0]?.id || "",
      conexoes: 0,
    };
    onChange("trechos", [...system.trechos, newSection]);
  };

  const removeSection = (index: number) => {
    const newSections = system.trechos.filter((_, i) => i !== index);
    onChange("trechos", newSections);
  };

  // Helper function to display value: show "" if value is 0 or null/undefined
  const displayValue = (val: number | string | undefined) => 
    val === 0 || val === undefined || val === "" ? "" : val;

  // Helper function to handle number input changes for the system
  const handleSystemNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SuctionSystem
  ) => {
    const value = e.target.value;
    if (value === "") {
      onChange(field, "");
    } else {
      const parsedValue = parseFloat(value);
      onChange(field, isNaN(parsedValue) ? "" : parsedValue);
    }
  };

  // Custom handler for pressure (Pa to bar conversion)
  const handlePressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onChange("pressao_manometrica", ""); // Store "" if input is empty
    } else {
      const parsedValue = parseFloat(value);
      // Convert bar to Pa for storage
      onChange("pressao_manometrica", isNaN(parsedValue) ? "" : parsedValue * 100000);
    }
  };

  // Custom display for pressure (Pa to bar conversion)
  const displayPressure = (pa: number | string | undefined) => {
    if (pa === 0 || pa === undefined || pa === "") return "";
    // Return the raw converted value as a string, without fixed decimals
    return String(Number(pa) / 100000);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Tipo de Reservatório</Label>
        <RadioGroup
          value={system.tipo_reservatorio}
          onValueChange={(value: "aberto" | "pressurizado") =>
            onChange("tipo_reservatorio", value)
          }
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="aberto" id="suc-aberto" />
            <Label htmlFor="suc-aberto">Aberto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pressurizado" id="suc-pressurizado" />
            <Label htmlFor="suc-pressurizado">Pressurizado</Label>
          </div>
        </RadioGroup>
      </div>

      {system.tipo_reservatorio === "pressurizado" && (
        <div>
          <Label htmlFor="suc-pressao">Pressão Manométrica (bar)</Label>
          <Input
            id="suc-pressao"
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
          <Label htmlFor="suc-H-nominal">Desnível Geométrico Nominal (m)</Label>
          <Input
            id="suc-H-nominal"
            type="number"
            step="0.1"
            value={displayValue(system.nivel_nominal)}
            onChange={(e) => handleSystemNumberChange(e, "nivel_nominal")}
            placeholder="0"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="suc-H-min">Desnível Geométrico Mínimo (m)</Label>
          <Input
            id="suc-H-min"
            type="number"
            step="0.1"
            value={displayValue(system.nivel_min)}
            onChange={(e) => handleSystemNumberChange(e, "nivel_min")}
            placeholder="0"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="suc-H-max">Desnível Geométrico Máximo (m)</Label>
          <Input
            id="suc-H-max"
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
          <h3 className="text-lg font-semibold text-card-foreground">
            Trechos de Tubulação
          </h3>
          <Button onClick={addSection} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Trecho
          </Button>
        </div>

        {system.trechos.map((section, index) => (
          <PipeSectionForm
            key={index}
            section={section}
            index={index}
            materials={materials}
            onChange={handleSectionChange}
            onRemove={removeSection}
            canRemove={system.trechos.length > 1}
          />
        ))}
      </div>
    </div>
  );
};
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
            value={
              system.pressao_manometrica
                ? (system.pressao_manometrica / 100000).toFixed(2)
                : ""
            }
            onChange={(e) =>
              onChange(
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
          <Label htmlFor="suc-nivel-nominal">Nível Nominal (m)</Label>
          <Input
            id="suc-nivel-nominal"
            type="number"
            step="0.1"
            value={system.nivel_nominal}
            onChange={(e) =>
              onChange("nivel_nominal", e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            placeholder="0"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="suc-nivel-min">Nível Mínimo (m)</Label>
          <Input
            id="suc-nivel-min"
            type="number"
            step="0.1"
            value={system.nivel_min}
            onChange={(e) =>
              onChange("nivel_min", e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            placeholder="0"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="suc-nivel-max">Nível Máximo (m)</Label>
          <Input
            id="suc-nivel-max"
            type="number"
            step="0.1"
            value={system.nivel_max}
            onChange={(e) =>
              onChange("nivel_max", e.target.value === "" ? "" : parseFloat(e.target.value))
            }
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

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoSistema } from "@/services/vazaoService";
import { cn } from "@/lib/utils";

interface SeletorTipoSistemaProps {
  value: TipoSistema | null;
  onChange: (tipo: TipoSistema) => void;
  disabled: boolean;
  highlightError?: boolean;
}

export const SeletorTipoSistema = ({ value, onChange, disabled, highlightError = false }: SeletorTipoSistemaProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tipo-sistema">Tipo de Sistema</Label>
      <Select
        value={value || ""}
        onValueChange={(v) => onChange(v as TipoSistema)}
        disabled={disabled}
      >
        <SelectTrigger 
          id="tipo-sistema" 
          className={cn("mt-1", highlightError && "border-destructive ring-destructive")}
        >
          <SelectValue placeholder="Selecione o tipo de sistema" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="predial">Predial</SelectItem>
          <SelectItem value="industrial">Industrial</SelectItem>
        </SelectContent>
      </Select>
      {highlightError && (
        <p className="text-xs text-destructive">Selecione o tipo de sistema válido</p>
      )}
    </div>
  );
};
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

// Configuration for all system types with their display names and NBR standards
const SYSTEM_TYPES_CONFIG: { value: TipoSistema; label: string; norma: string }[] = [
  { value: 'agua_fria', label: '💧 Água Fria', norma: 'NBR 5626' },
  { value: 'esgoto', label: '🚰 Esgoto Sanitário', norma: 'NBR 8160' },
  { value: 'pluvial', label: '🌧️ Águas Pluviais', norma: 'NBR 10844' },
  { value: 'incendio', label: '🔥 Prevenção a Incêndio', norma: 'NBR 13714' },
  { value: 'efluentes', label: '🏭 Efluentes (Tanques Sépticos)', norma: 'NBR 13969' }
];

export const SeletorTipoSistema = ({ value, onChange, disabled, highlightError = false }: SeletorTipoSistemaProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tipo-sistema">Tipo de Sistema Hidráulico</Label>
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
          {SYSTEM_TYPES_CONFIG.map((system) => (
            <SelectItem key={system.value} value={system.value}>
              <div className="flex items-center justify-between w-full">
                <span>{system.label}</span>
                <span className="text-xs text-muted-foreground ml-4">{system.norma}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {highlightError && (
        <p className="text-xs text-destructive">Selecione o tipo de sistema válido</p>
      )}
      <p className="text-xs text-muted-foreground">
        Cada sistema possui requisitos específicos conforme normas ABNT
      </p>
    </div>
  );
};
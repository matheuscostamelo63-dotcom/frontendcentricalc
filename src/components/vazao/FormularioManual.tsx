import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2, AlertTriangle } from "lucide-react";
import { TipoSistema } from "@/services/vazaoService";
import { cn } from "@/lib/utils";

interface FormularioManualProps {
  tipoSistema: TipoSistema;
  onSubmit: (vazao: number) => void;
  loading: boolean;
  highlightError?: boolean;
  currentQ: number | string; // Novo: Valor atual de Q do estado pai
  onChangeQ: (value: string) => void; // Novo: Handler para atualizar Q no estado pai
}

export const FormularioManual = ({ 
  tipoSistema, 
  onSubmit, 
  loading, 
  highlightError = false, 
  currentQ, 
  onChangeQ 
}: FormularioManualProps) => {
  
  // Mantemos o estado de erro local para validação imediata
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const vazaoInput = String(currentQ);
  const vazaoValue = parseFloat(vazaoInput);
  const isValid = vazaoValue > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 1. Atualiza o estado pai imediatamente
    onChangeQ(value);

    // 2. Realiza validações locais
    setError(null);
    setShowWarning(false);

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError("Vazão deve ser um número positivo.");
    } else if (numValue > 10000) {
      setShowWarning(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError("Informe a vazão desejada.");
      return;
    }
    // Submete o valor válido para o handler de API
    onSubmit(vazaoValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vazao-manual">Vazão de Projeto (m³/h)</Label>
        <Input
          id="vazao-manual"
          type="number"
          step="0.1"
          min="0"
          value={vazaoInput}
          onChange={handleChange}
          placeholder="Ex: 150.0"
          disabled={loading}
          className={cn("mt-1", (error || highlightError) && "border-destructive ring-destructive")}
        />
        {(error || highlightError) && (
          <p className="text-xs text-destructive">{error || "Vazão deve ser maior que zero."}</p>
        )}
        {showWarning && !error && (
          <div className="flex items-center gap-2 text-sm text-warning">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>Aviso: Vazão muito alta. Confirme se o valor está correto.</span>
          </div>
        )}
      </div>
      
      <Button type="submit" disabled={!isValid || loading} className="w-full gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Calculando...
          </>
        ) : (
          <>
            <Calculator className="h-4 w-4" />
            Calcular Vazão
          </>
        )}
      </Button>
    </form>
  );
};
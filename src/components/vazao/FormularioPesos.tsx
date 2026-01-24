import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2 } from "lucide-react";
import { TipoSistema, PecaInput } from "@/services/vazaoService";
import { ListaPecasSanitarias } from "./ListaPecasSanitarias";
import { toast } from "sonner";

interface FormularioPesosProps {
  tipoSistema: TipoSistema;
  onSubmit: (pecas: PecaInput[]) => void;
  loading: boolean;
  highlightError?: boolean;
}

export const FormularioPesos = ({ tipoSistema, onSubmit, loading, highlightError = false }: FormularioPesosProps) => {
  // State stores { tipo: quantidade }
  const [pecasQuantidades, setPecasQuantidades] = useState<Record<string, number>>({});
  
  const handleQuantityChange = (tipo: string, quantidade: number) => {
    setPecasQuantidades(prev => {
      const newState = { ...prev, [tipo]: quantidade };
      // Clean up zero entries to keep state minimal
      if (quantidade === 0) {
        delete newState[tipo];
      }
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pecas: PecaInput[] = Object.entries(pecasQuantidades)
      .filter(([, quantidade]) => quantidade > 0)
      .map(([tipo, quantidade]) => ({ tipo, quantidade }));

    if (pecas.length === 0) {
      // Client-side validation for PECAS_VAZIAS/SOMA_PESOS_ZERO
      onSubmit([]); // Send empty array to trigger API error handling or handle locally
      return;
    }

    onSubmit(pecas);
  };

  // Check if any piece has quantity > 0
  const hasValidInput = Object.values(pecasQuantidades).some(q => q > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ListaPecasSanitarias
        valores={pecasQuantidades}
        onChange={handleQuantityChange}
        disabled={loading}
        highlightError={highlightError}
      />
      
      <Button type="submit" disabled={!hasValidInput || loading} className="w-full gap-2">
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
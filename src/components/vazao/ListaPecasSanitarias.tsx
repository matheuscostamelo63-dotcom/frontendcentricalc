import { PECAS_SANITARIAS, PecaSanitaria } from "@/constants/pecasSanitarias";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Scale } from "lucide-react";

interface ListaPecasSanitariasProps {
  valores: { [tipo: string]: number };
  onChange: (tipo: string, quantidade: number) => void;
  disabled: boolean;
  highlightError?: boolean;
}

export const ListaPecasSanitarias = ({ valores, onChange, disabled, highlightError = false }: ListaPecasSanitariasProps) => {
  
  const pecasComValores = PECAS_SANITARIAS.map(peca => {
    const quantidade = valores[peca.tipo] || 0;
    const pesoTotal = peca.peso * quantidade;
    return { ...peca, quantidade, pesoTotal };
  });

  const somaPesos = pecasComValores.reduce((sum, peca) => sum + peca.pesoTotal, 0);

  const handleQuantityChange = (tipo: string, value: string) => {
    const parsedValue = parseInt(value);
    const quantity = isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;
    onChange(tipo, quantity);
  };

  return (
    <div className="space-y-4">
      <Card className={cn(highlightError && "border-destructive ring-destructive")}>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Peças Sanitárias (NBR 5626)
            </h4>
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <Scale className="h-4 w-4" />
              Σ Pesos: {somaPesos.toFixed(1)}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2 pr-2" id="lista-pecas">
            {pecasComValores.map((peca) => (
              <div key={peca.tipo} className="flex items-center justify-between gap-4 py-1 border-b border-border/50 last:border-b-0">
                <div className="flex-1">
                  <Label className="text-sm font-medium block">
                    {peca.nome}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Peso unitário: {peca.peso.toFixed(1)}
                  </span>
                </div>
                <div className="w-20 flex-shrink-0">
                  <Input
                    id={`quantidade-peca-${peca.tipo}`}
                    type="number"
                    step="1"
                    min="0"
                    value={peca.quantidade > 0 ? peca.quantidade : ""}
                    onChange={(e) => handleQuantityChange(peca.tipo, e.target.value)}
                    placeholder="0"
                    disabled={disabled}
                    className="h-8 text-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {highlightError && (
        <p className="text-xs text-destructive">Selecione pelo menos uma peça sanitária com quantidade maior que zero.</p>
      )}
    </div>
  );
};
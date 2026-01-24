import { VazaoResult, MetodoVazao } from "@/services/vazaoService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Edit, Zap } from "lucide-react";
import { DetalhesCalculoPesos } from "./DetalhesCalculoPesos";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ResultadoVazaoProps {
  vazao: VazaoResult;
  onConfirmar: () => void;
  onEditar: () => void;
}

export const ResultadoVazao = ({ vazao, onConfirmar, onEditar }: ResultadoVazaoProps) => {
  const isPesos = vazao.origem === 'metodo_pesos';

  return (
    <Card className="border-primary/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Vazão de Projeto Definida
        </CardTitle>
        <Badge 
          variant={isPesos ? "default" : "secondary"}
          className="text-sm"
        >
          Origem: {isPesos ? "Método dos Pesos" : "Manual"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Vazão (m³/h)</p>
            <p className="text-3xl font-extrabold text-primary">
              {vazao.valor_m3h.toFixed(2)}
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Vazão (L/s)</p>
            <p className="text-2xl font-bold text-foreground">
              {vazao.valor_ls.toFixed(2)}
            </p>
          </div>
        </div>

        {isPesos && vazao.detalhes.pecas && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="link" className="p-0 h-auto text-sm">
                Ver Detalhes do Cálculo por Pesos
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <DetalhesCalculoPesos 
                detalhes={vazao.detalhes as any} // Cast to any since details structure is guaranteed here
              />
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onConfirmar} 
            className="flex-1 gap-2"
          >
            <Check className="h-4 w-4" />
            Confirmar e Avançar
          </Button>
          <Button 
            onClick={onEditar} 
            variant="outline" 
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
import { CheckCircle, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValidacaoResponse } from "@/types/reservatorio";
import { cn } from "@/lib/utils";

interface ResultadoValidacaoProps {
  dados: ValidacaoResponse;
  onRecalcular: () => void;
}

export const ResultadoValidacao = ({ dados, onRecalcular }: ResultadoValidacaoProps) => {
  if (!dados) return null;

  const { status, diferenca_m3, percentual_atendimento, recomendacao } = dados;

  const statusConfig = {
    adequado: {
      icon: CheckCircle,
      color: "success",
      titulo: "ADEQUADO",
      descricao: "O reservatório atende aos requisitos da NBR 5626.",
      cardClass: "border-success bg-success/10",
    },
    insuficiente: {
      icon: XCircle,
      color: "destructive",
      titulo: "INSUFICIENTE",
      descricao: "O reservatório é menor que o volume necessário.",
      cardClass: "border-destructive bg-destructive/10",
    },
    excedente: {
      icon: Info,
      color: "primary",
      titulo: "EXCEDENTE",
      descricao: "O reservatório é maior que o volume necessário.",
      cardClass: "border-primary bg-primary/10",
    },
  };

  const config = statusConfig[status] || statusConfig.insuficiente;
  const Icon = config.icon;
  const isPositive = diferenca_m3 >= 0;

  return (
    <Card className={cn("shadow-lg", config.cardClass)}>
      <CardHeader>
        <CardTitle className="text-xl">Resultado da Validação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-card shadow-sm">
          <Icon className={cn("h-10 w-10 flex-shrink-0", `text-${config.color}`)} />
          <div className="space-y-1">
            <h4 className={cn("text-lg font-bold", `text-${config.color}`)}>{config.titulo}</h4>
            <p className="text-sm text-muted-foreground">{config.descricao}</p>
          </div>
        </div>

        <div className="space-y-3 p-4 bg-secondary rounded-lg">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold text-muted-foreground">Diferença:</span>
            <span className={cn("font-bold text-lg", isPositive ? "text-success" : "text-destructive")}>
              {isPositive ? '+' : ''}{diferenca_m3.toFixed(2)} m³
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-muted-foreground">Atendimento:</span>
            <span className="font-bold text-lg text-primary">
              {percentual_atendimento.toFixed(1)}%
            </span>
          </div>
        </div>

        {recomendacao && (
          <div className="p-4 border-l-4 border-primary bg-primary/10 rounded-md">
            <h5 className="font-semibold text-primary flex items-center gap-2 mb-1">
              <Info className="h-4 w-4" /> Recomendação
            </h5>
            <p className="text-sm text-primary-foreground/80">{recomendacao}</p>
          </div>
        )}

        <Button
          variant="outline"
          onClick={onRecalcular}
          className="w-full mt-4 gap-2"
        >
          Recalcular
        </Button>
      </CardContent>
    </Card>
  );
};
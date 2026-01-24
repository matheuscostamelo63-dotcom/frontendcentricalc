import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetodoVazao } from "@/services/vazaoService";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface AbasMetodoVazaoProps {
  metodosPermitidos: MetodoVazao[];
  metodoRecomendado: MetodoVazao | null;
  metodoAtivo: MetodoVazao;
  onChangeMetodo: (metodo: MetodoVazao) => void;
}

export const AbasMetodoVazao = ({
  metodosPermitidos,
  metodoRecomendado,
  metodoAtivo,
  onChangeMetodo,
}: AbasMetodoVazaoProps) => {
  const tabsConfig: { value: MetodoVazao; label: string }[] = [
    { value: "manual", label: "Entrada Manual" },
    { value: "metodo_pesos", label: "Método dos Pesos (NBR 5626)" },
  ];

  return (
    <Tabs value={metodoAtivo} onValueChange={(v) => onChangeMetodo(v as MetodoVazao)}>
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:w-auto">
        {tabsConfig.map(({ value, label }) => {
          const isPermitted = metodosPermitidos.includes(value);
          const isRecommended = value === metodoRecomendado;

          return (
            <TabsTrigger
              key={value}
              value={value}
              disabled={!isPermitted}
              className="relative"
            >
              {label}
              {isRecommended && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-[-10px] right-[-10px] h-4 px-1 text-xs font-normal bg-accent text-accent-foreground"
                  title="Método Recomendado"
                >
                  <Lightbulb className="h-3 w-3 mr-1" /> Rec.
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};
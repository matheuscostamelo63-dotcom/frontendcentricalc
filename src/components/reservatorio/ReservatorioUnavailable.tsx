import { AlertTriangle, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ReservatorioUnavailable = () => {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card className="max-w-xl w-full border-l-4 border-warning bg-warning/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-warning" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Cálculo de Reservatório Indisponível
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-lg text-foreground">
            A funcionalidade de cálculo e validação de reservatórios é aplicável
            apenas para <strong className="font-bold">sistemas prediais</strong> (água fria para habitações,
            prédios comerciais, etc.).
          </p>

          <div className="p-4 bg-warning/20 rounded-md space-y-2">
            <h3 className="font-semibold text-warning">Por quê?</h3>
            <ul className="list-disc list-inside text-sm text-foreground/90 space-y-1 ml-4">
              <li>
                <strong>Sistemas Industriais</strong> possuem requisitos específicos
                definidos pelos processos de produção.
              </li>
              <li>
                O cálculo automático segue a <strong>NBR 5626</strong>, que é
                específica para sistemas prediais.
              </li>
              <li>
                Cada sistema industrial requer análise técnica personalizada.
              </li>
            </ul>
          </div>

          <div className="text-center space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Para sistemas industriais, consulte a documentação técnica específica
              ou altere o tipo de sistema nas configurações do projeto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import { useSistema } from "@/context/SistemaContext";
import { ReservatorioUnavailable } from "@/components/reservatorio/ReservatorioUnavailable";
import { ReservatorioContainer } from "@/components/reservatorio/ReservatorioContainer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ReservatorioPage = () => {
  const { tipoSistema } = useSistema();

  return (
    <div className="py-8">
      <div className="mb-8 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Cálculo de Reservatório
        </h1>
        <p className="text-muted-foreground">
          Dimensionamento e validação de volumes de reservatórios prediais.
        </p>
      </div>

      {tipoSistema === 'predial' ? (
        <ReservatorioContainer />
      ) : tipoSistema === 'industrial' ? (
        <ReservatorioUnavailable />
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tipo de Sistema Não Definido:</strong> Por favor, retorne à página de Novo Dimensionamento e selecione o tipo de sistema (Predial ou Industrial) para continuar.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ReservatorioPage;
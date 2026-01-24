import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StatusBannerProps {
  status: "ok" | "warning" | "error" | "validation_error";
}

export const StatusBanner = ({ status }: StatusBannerProps) => {
  const config = {
    ok: {
      icon: CheckCircle,
      title: "Cálculo Concluído com Sucesso",
      description: "O dimensionamento foi realizado sem problemas.",
      variant: "default" as const,
      className: "border-success bg-success/10 text-success",
    },
    warning: {
      icon: AlertTriangle,
      title: "Cálculo Concluído com Avisos",
      description:
        "O dimensionamento foi realizado, mas há avisos que requerem atenção.",
      variant: "default" as const,
      className: "border-warning bg-warning/10 text-warning",
    },
    error: {
      icon: XCircle,
      title: "Erro no Cálculo",
      description:
        "Ocorreu um erro durante o dimensionamento. Verifique os detalhes abaixo.",
      variant: "destructive" as const,
      className: "",
    },
    validation_error: {
      icon: AlertCircle,
      title: "Erro de Validação",
      description:
        "Os dados fornecidos contêm erros. Corrija-os antes de tentar novamente.",
      variant: "destructive" as const,
      className: "",
    },
  };

  const { icon: Icon, title, description, variant, className } = config[status];

  return (
    <Alert variant={variant} className={className}>
      <Icon className="h-5 w-5" />
      <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

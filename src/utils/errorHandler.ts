import { toast } from "sonner";
import { ApiError } from "@/services/vazaoService";

// Define a map for error messages and UI actions
const ERROR_MESSAGES: Record<string, { toast: string; campo: string | null; tipo: 'error' | 'warning' }> = {
  'PECAS_VAZIAS': {
    toast: "Selecione pelo menos uma peça sanitária",
    campo: "lista-pecas",
    tipo: "warning"
  },
  'QUANTIDADE_INVALIDA': {
    toast: "Verifique as quantidades informadas",
    campo: "quantidade-peca",
    tipo: "error"
  },
  'TIPO_INVALIDO': {
    toast: "Tipo de peça inválido",
    campo: null,
    tipo: "error"
  },
  'TIPO_SISTEMA_INVALIDO': {
    toast: "Selecione um tipo de sistema válido",
    campo: "tipo-sistema",
    tipo: "error"
  },
  'VAZAO_INVALIDA': {
    toast: "Vazão deve ser maior que zero",
    campo: "vazao-manual",
    tipo: "error"
  },
  'METODO_NAO_PERMITIDO': {
    toast: "Este método não está disponível para sistemas industriais",
    campo: null,
    tipo: "warning"
  },
  'SOMA_PESOS_ZERO': {
    toast: "Adicione peças com quantidade para calcular",
    campo: "lista-pecas",
    tipo: "warning"
  },
};

/**
 * Handles API errors by displaying a toast and returning the field to highlight.
 * @param error The ApiError object.
 * @returns The string identifier of the field to highlight, or null.
 */
export function handleApiError(error: ApiError): string | null {
  const config = ERROR_MESSAGES[error.codigo] || {
    toast: error.mensagem,
    campo: null,
    tipo: "error"
  };

  if (config.tipo === 'error') {
    toast.error(config.toast);
  } else {
    toast.warning(config.toast);
  }

  return config.campo;
}
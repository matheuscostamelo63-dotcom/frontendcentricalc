import { toast } from "sonner";

// Reusing API_BASE_URL from lib/api.ts context, but defining it locally for clarity in the service layer
// Definindo a URL base sem o prefixo /api, para ser consistente com src/lib/api.ts
const API_BASE_URL = "https://dimensionamento-git-main-matheus-melos-projects-cbf6112f.vercel.app";

export type TipoSistema = "predial" | "industrial";
export type MetodoVazao = "manual" | "metodo_pesos";

export interface PecaInput {
  tipo: string;
  quantidade: number;
}

export interface PecaDetalhe {
  tipo: string;
  nome_exibicao: string;
  quantidade: number;
  peso_unitario: number;
  peso_total: number;
}

export interface VazaoResult {
  valor_ls: number;
  valor_m3h: number;
  origem: MetodoVazao;
  tipo_sistema: TipoSistema;
  timestamp: string;
  detalhes: {
    soma_pesos?: number;
    formula_aplicada?: string;
    pecas?: PecaDetalhe[];
    informado_pelo_usuario?: boolean;
  };
}

export interface VazaoValidationResponse {
  tipo_sistema: TipoSistema;
  metodos_permitidos: MetodoVazao[];
  recomendado: MetodoVazao;
}

export interface ApiError {
  codigo: string;
  mensagem: string;
  detalhes: object;
}

export interface ApiResponse<T> {
  sucesso: boolean;
  dados: T | null;
  erro: ApiError | null;
}

async function fetchApi<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON, or body is empty, data remains {}
    }

    if (response.ok) {
      return { sucesso: true, dados: data.dados as T, erro: null };
    } else {
      // Handle non-200 responses
      const error: ApiError = data.erro || { 
        codigo: `HTTP_ERROR_${response.status}`, 
        mensagem: data.message || `Erro de rede ou servidor (${response.status}) ao acessar ${endpoint}`, 
        detalhes: data 
      };
      return { sucesso: false, dados: null, erro: error };
    }
  } catch (networkError: any) {
    // Handle network failures (e.g., CORS, DNS, offline)
    const error: ApiError = {
      codigo: 'NETWORK_FAILURE',
      mensagem: `Falha de conexão ao tentar acessar o serviço: ${networkError.message}`,
      detalhes: { url }
    };
    return { sucesso: false, dados: null, erro: error };
  }
}

export async function validarTipoVazao(tipoSistema: TipoSistema): Promise<VazaoValidationResponse> {
  const response = await fetchApi<{ tipo_sistema: TipoSistema, metodos_permitidos: MetodoVazao[], recomendado: MetodoVazao }>('/validar-tipo-vazao', { tipo_sistema: tipoSistema });
  
  if (response.sucesso && response.dados) {
    return response.dados;
  }
  
  // Fallback if API fails or returns error structure
  // Usamos o erro retornado pela API ou o fallback genérico
  toast.error(response.erro?.mensagem || "Falha ao validar tipo de sistema. Usando configurações padrão.");
  return {
    tipo_sistema: tipoSistema,
    metodos_permitidos: tipoSistema === 'predial' ? ['manual', 'metodo_pesos'] : ['manual'],
    recomendado: tipoSistema === 'predial' ? 'metodo_pesos' : 'manual',
  };
}

export async function calcularVazaoPesos(
  tipoSistema: TipoSistema, 
  pecas: PecaInput[]
): Promise<ApiResponse<{ vazao: VazaoResult }>> {
  return fetchApi<{ vazao: VazaoResult }>('/calcular-vazao-pesos', { 
    tipo_sistema: tipoSistema,
    pecas: pecas 
  });
}

export async function definirVazaoManual(
  tipoSistema: TipoSistema, 
  vazaoM3h: number
): Promise<ApiResponse<{ vazao: VazaoResult }>> {
  return fetchApi<{ vazao: VazaoResult }>('/definir-vazao-manual', { 
    tipo_sistema: tipoSistema,
    vazao_m3h: vazaoM3h 
  });
}
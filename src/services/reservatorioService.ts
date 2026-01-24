import { toast } from "sonner";
import {
  TipoEdificacao,
  TipoDistribuicao,
  CalculoRequest,
  CalculoResponse,
  ValidacaoRequest,
  ValidacaoResponse,
} from "@/types/reservatorio";
import { ApiResponse, ApiError } from "./vazaoService"; // Reusing ApiResponse/ApiError structure

const API_BASE_URL = "https://dimensionamento-git-main-matheus-melos-projects-cbf6112f.vercel.app";

// Custom Error Class for structured error handling
export class ReservatorioError extends Error {
  public code: string;
  public details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'ReservatorioError';
    this.code = code;
    this.details = details;
  }
}

async function fetchReservatorioApi<T>(endpoint: string, body?: object): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data: ApiResponse<T> = { sucesso: false, dados: null, erro: null };
    try {
      data = await response.json();
    } catch (e) {
      // If response is not JSON
    }

    if (response.ok && data.sucesso && data.dados) {
      return data.dados;
    } else {
      // Handle non-200 responses or API success: false
      const error: ApiError = data.erro || { 
        codigo: `HTTP_ERROR_${response.status}`, 
        mensagem: data.message || `Erro de rede ou servidor (${response.status}) ao acessar ${endpoint}`, 
        detalhes: data 
      };
      
      // Throw custom error for structured handling
      throw new ReservatorioError(error.mensagem, error.codigo, error.detalhes);
    }
  } catch (networkError: any) {
    if (networkError instanceof ReservatorioError) {
        throw networkError;
    }
    // Handle network failures (e.g., CORS, DNS, offline)
    throw new ReservatorioError(
      `Falha de conexão ao tentar acessar o serviço: ${networkError.message}`,
      'NETWORK_FAILURE',
      { url }
    );
  }
}

export async function getTiposEdificacao(): Promise<TipoEdificacao[]> {
  const data = await fetchReservatorioApi<{ tipos: TipoEdificacao[] }>('/tipos-edificacao');
  return data.tipos || [];
}

export async function getTiposDistribuicao(): Promise<TipoDistribuicao[]> {
  const data = await fetchReservatorioApi<{ tipos: TipoDistribuicao[] }>('/tipos-distribuicao');
  return data.tipos || [];
}

export async function calcularReservatorio(dados: CalculoRequest): Promise<CalculoResponse> {
  const data = await fetchReservatorioApi<{ resultado: CalculoResponse }>('/calcular-reservatorio', dados);
  return data.resultado;
}

export async function validarReservatorio(dados: ValidacaoRequest): Promise<ValidacaoResponse> {
  const data = await fetchReservatorioApi<{ resultado: ValidacaoResponse }>('/validar-reservatorio', dados);
  return data.resultado;
}
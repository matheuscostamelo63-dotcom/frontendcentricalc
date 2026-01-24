import { TipoSistema } from "@/services/vazaoService";

export interface TipoEdificacao {
  chave: string;
  nome: string;
  consumo_per_capita_litros: number;
  descricao: string;
  requer_entrada_manual: boolean;
  unidade: string;
}

export interface TipoDistribuicao {
  chave: 'gravidade' | 'misto' | 'pressurizado';
  nome: string;
  descricao: string;
}

export interface CalculoRequest {
  tipo_sistema: TipoSistema; // Should be 'predial' for this calculation
  tipo_edificacao: string;
  populacao: number;
  autonomia_dias: number;
  tipo_distribuicao: string;
  reserva_incendio_m3?: number;
  consumo_manual_m3?: number;
}

export interface CalculoResponse {
  consumo_diario_m3: number;
  volume_minimo_m3: number;
  reserva_incendio_m3: number;
  volume_total_m3: number;
  volume_superior_m3: number;
  volume_inferior_m3: number;
  percentual_superior: number;
  percentual_inferior: number;
  observacoes: string[];
}

export interface ValidacaoRequest {
  tipo_sistema: TipoSistema; // Should be 'predial'
  volume_existente_m3: number;
  volume_necessario_m3: number;
}

export interface ValidacaoResponse {
  status: 'adequado' | 'insuficiente' | 'excedente';
  diferenca_m3: number;
  percentual_atendimento: number;
  recomendacao: string;
}
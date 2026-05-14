import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = "https://dimensionamento-git-main-matheus-melos-projects-cbf6112f.vercel.app";

export interface Material {
  id: string;
  nome: string;
  rugosidade_mm: number;
}

export interface Componente {
  id: string;
  nome: string;
  k: number;
  categoria: string;
}

export interface PipeSection {
  L: number;
  D: number;
  material: string;
  rugosidade_mm?: number;
  conexoes: number; // Kept for legacy/API structure, though new UI won't use it directly
  k_manual?: number;
  componentes?: string[]; // Array of component IDs
}

export interface ReservoirData {
  tipo_reservatorio: "aberto" | "pressurizado";
  pressao_manometrica?: number;
  nivel_nominal: number; // Desnível Geométrico Nominal (m)
  nivel_min: number; // Desnível Geométrico Mínimo (m)
  nivel_max: number; // Desnível Geométrico Máximo (m)
}

export interface SuctionSystem extends ReservoirData {
  succao_id: string; // Identificador para múltiplas sucções
  trechos: PipeSection[];
}

export interface DischargeSystem extends ReservoirData {
  destino_id: string;
  trechos: PipeSection[];
}

export interface FluidParameters {
  densidade: number;
  viscosidade: number;
  temperatura: number;
  pressao_atm: number;
}

export interface CalculationInput {
  name: string;
  usuario: string;
  Q: number;
  NPSHr: number;
  fluido: FluidParameters;
  suc: SuctionSystem[]; // Alterado para array
  recalque: DischargeSystem[];
  reservatorio_dados?: object;
}

export interface DestinationResult {
  destino_id: string;
  Hmt_pior: number;
  Hmt_nominal: number;
  Hmt_melhor: number;
  NPSHa: number;
  cavitation_ok: boolean;
  hf_rec: number;
  hl_rec: number;
  v_rec_max: number;
}

export interface MotorDimensionamento {
  eta_bomba_assumida: number;
  eta_motor_assumida: number;
  P_hidraulica_kW: number;
  P_eixo_kW: number;
  P_motor_calculado_kW: number;
  P_motor_nominal_kW: number;
  P_motor_nominal_cv: number;
}

export interface CalculationResult {
  status: "ok" | "warning" | "error" | "validation_error";
  errors?: Array<{ campo: string; mensagem: string; tipo?: string }>;
  warnings?: Array<{ nivel: string; categoria: string; mensagem: string }>;
  recomendacoes?: string[];
  H_mt_necessario?: number;
  pressao_descarga_bomba_bar?: number;
  P_hid_kW?: number;
  velocidade_succao_max?: number;
  NPSHa_global_min?: number;
  temperatura?: number;
  viscosidade_cp?: number;
  resultados_destinos?: DestinationResult[];
  pdf_url?: string;
  motor?: MotorDimensionamento;
  ns_1450?: number;
  ns_2900?: number;
  tipo_bomba_ns?: string;
  dn_suc_mm?: number;
  dn_rec_mm?: number;
}

export const getAuthHeader = async (): Promise<Record<string, string>> => {
  try {
    // First attempt: get current session
    let { data: { session } } = await supabase.auth.getSession();

    // If no session or token is missing, try to refresh
    if (!session?.access_token) {
      console.warn("[Auth] Sessão não encontrada, tentando refresh...");
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("[Auth] Erro ao fazer refresh da sessão:", refreshError.message);
      } else {
        session = refreshData.session;
      }
    }

    if (session?.access_token) {
      console.log("[Auth] Token encontrado, enviando requisição autenticada.");
      return { 'Authorization': `Bearer ${session.access_token}` };
    } else {
      console.error("[Auth] Nenhum token disponível após getSession e refreshSession. Usuário pode estar deslogado.");
    }
  } catch (e) {
    console.error("[Auth] Erro inesperado ao obter token:", e);
  }
  return {};
};

export function normalizeResult(raw: any): CalculationResult {
  // Suporta tanto o formato novo (sucesso/resultado/alertas) quanto o legado (status direto)
  if (raw.status && !raw.sucesso && raw.sucesso !== false) {
    return raw as CalculationResult;
  }

  const resultado = raw.resultado || {};
  const alertas: any[] = raw.alertas || [];
  const resumo = raw.resumo_alertas || {};

  let status: CalculationResult["status"];
  if (!raw.sucesso) {
    status = "error";
  } else if ((resumo.impeditivo ?? 0) > 0 || (resumo.critico ?? 0) > 0) {
    status = "error";
  } else if ((resumo.atencao ?? 0) > 0) {
    status = "warning";
  } else {
    status = "ok";
  }

  const errors = alertas
    .filter(a => ["CRITICO", "IMPEDITIVO"].includes(a.severidade))
    .map(a => ({ campo: a.tipo || "geral", mensagem: a.mensagem }));

  const warnings = alertas
    .filter(a => ["ATENCAO", "INFO"].includes(a.severidade))
    .map(a => ({ nivel: a.severidade, categoria: a.tipo || "geral", mensagem: a.mensagem }));

  const recomendacoes = alertas.flatMap(a => a.recomendacoes || []);

  const alturaM: number | undefined = resultado.altura_manometrica_m;

  return {
    status,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    recomendacoes: recomendacoes.length > 0 ? recomendacoes : undefined,
    H_mt_necessario: alturaM,
    pressao_descarga_bomba_bar: alturaM != null ? parseFloat((alturaM * 0.0981).toFixed(3)) : undefined,
    P_hid_kW: raw.P_hid_kW ?? (resultado.potencia_cv != null ? parseFloat((resultado.potencia_cv * 0.7355).toFixed(3)) : undefined),
    velocidade_succao_max: resultado["velocidade_sucção_ms"] ?? resultado.velocidade_succao_ms,
    NPSHa_global_min: resultado.npsh_disponivel_m,
    temperatura: resultado.temperatura,
    resultados_destinos: raw.resultados_destinos,
    pdf_url: raw.pdf_url
      ? raw.pdf_url.startsWith("http")
        ? raw.pdf_url
        : `${API_BASE_URL}${raw.pdf_url}`
      : undefined,
    motor: raw.motor,
    ns_1450: raw.ns_1450,
    ns_2900: raw.ns_2900,
    tipo_bomba_ns: raw.tipo_bomba_ns,
    dn_suc_mm: raw.dn_suc_mm,
    dn_rec_mm: raw.dn_rec_mm,
  };
}

export const api = {
  async getMateriais(): Promise<Material[]> {
    const response = await fetch(`${API_BASE_URL}/api/materiais`);
    if (!response.ok) {
      throw new Error("Erro ao buscar materiais");
    }
    const data = await response.json();
    return data.materiais || [];
  },

  async getComponentes(): Promise<Componente[]> {
    const response = await fetch(`${API_BASE_URL}/api/componentes`);
    if (!response.ok) {
      throw new Error("Erro ao buscar componentes de perda de carga.");
    }
    const data = await response.json();
    return data.componentes || [];
  },

  async calcular(data: CalculationInput): Promise<CalculationResult> {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/api/calcular`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(data),
    });

    if (response.status === 429) {
      throw new Error("Muitas requisições. Por favor, aguarde alguns segundos e tente novamente.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao realizar cálculo");
    }

    const raw = await response.json();
    return normalizeResult(raw);
  },
};

// Unit conversion utilities
export const conversions = {
  m3hToM3s: (m3h: number) => m3h / 3600,
  m3sToM3h: (m3s: number) => m3s * 3600,
  mmToM: (mm: number) => mm / 1000,
  mToMm: (m: number) => m * 1000,
  cpToPas: (cp: number) => cp / 1000,
  pasToCp: (pas: number) => pas * 1000,
  barToPa: (bar: number) => bar * 100000,
  paToBar: (pa: number) => pa / 100000,
  kpaToPa: (kpa: number) => kpa * 1000,
  paToKpa: (pa: number) => pa / 1000,
};
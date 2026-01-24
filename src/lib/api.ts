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
    const response = await fetch(`${API_BASE_URL}/api/calcular`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    return response.json();
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
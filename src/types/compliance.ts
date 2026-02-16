
// ── Enums ──────────────────────────────────────

export type TipoSistema = 'esgoto' | 'pluvial' | 'incendio' | 'efluentes' | 'agua_fria';

export type Severidade = 'IMPEDITIVA' | 'AVISO' | 'BLOQUEIO';

// ── Request ────────────────────────────────────

export interface ValidationRequest {
    tipo_sistema: TipoSistema;
    dados: Record<string, unknown>;
}

// ── Response (espelha ResultadoValidacao.to_dict() do backend) ──

export interface AlertaDetalhe {
    codigo: string;
    mensagem: string;
    severidade: Severidade;
}

export interface ValidationResponse {
    is_valid: boolean;
    norma: string;
    erros: AlertaDetalhe[];
    avisos: AlertaDetalhe[];
    parametros_calculados: Record<string, number | string | boolean>;
    timestamp: string;
}

// ── Erros da API ───────────────────────────────

export interface ApiErrorPayload {
    error: string;
    codigo?: string;
    requeridos?: string[];
    codigo_alerta?: string;
    norma?: string;
}

export type ApiErrorType = 'PAYLOAD_INVALIDO' | 'VIOLACAO_NORMATIVA' | 'ERRO_INTERNO';

export interface ApiError {
    tipo: ApiErrorType;
    status: number;
    body: ApiErrorPayload;
}

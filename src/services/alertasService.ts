import { toast } from "sonner";
import {
    Alerta,
    ConfirmacaoPayload,
    VerificacaoConfirmacaoResponse,
} from "@/types/alertas";
import { ApiResponse, ApiError } from "./vazaoService";

// Reutilizando a mesma URL base do vazaoService
const API_BASE_URL =
    "https://dimensionamento-git-main-matheus-melos-projects-cbf6112f.vercel.app";

async function fetchApi<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api${endpoint}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
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
                mensagem:
                    data.message ||
                    `Erro de rede ou servidor (${response.status}) ao acessar ${endpoint}`,
                detalhes: data,
            };
            return { sucesso: false, dados: null, erro: error };
        }
    } catch (networkError: any) {
        // Handle network failures (e.g., CORS, DNS, offline)
        const error: ApiError = {
            codigo: "NETWORK_FAILURE",
            mensagem: `Falha de conexão ao tentar acessar o serviço: ${networkError.message}`,
            detalhes: { url },
        };
        return { sucesso: false, dados: null, erro: error };
    }
}

/**
 * Confirma alertas críticos após aceite de riscos pelo usuário
 * POST /api/alertas/confirmar
 */
export async function confirmarAlertas(
    payload: ConfirmacaoPayload
): Promise<ApiResponse<{ mensagem: string }>> {
    if (!payload.termos_aceitos) {
        const error: ApiError = {
            codigo: "TERMOS_NAO_ACEITOS",
            mensagem: "É necessário aceitar os termos para confirmar os alertas",
            detalhes: {},
        };
        return { sucesso: false, dados: null, erro: error };
    }

    const response = await fetchApi<{ mensagem: string }>(
        "/alertas/confirmar",
        payload
    );

    if (response.sucesso) {
        toast.success("Alertas confirmados com sucesso");
    } else {
        toast.error(
            response.erro?.mensagem || "Erro ao confirmar alertas. Tente novamente."
        );
    }

    return response;
}

/**
 * Verifica se os alertas foram confirmados e se pode gerar PDF
 * POST /api/alertas/verificar-confirmacao
 */
export async function verificarConfirmacao(
    projetoId: string,
    usuarioId: string
): Promise<ApiResponse<VerificacaoConfirmacaoResponse>> {
    const response = await fetchApi<VerificacaoConfirmacaoResponse>(
        "/alertas/verificar-confirmacao",
        {
            projeto_id: projetoId,
            usuario_id: usuarioId,
        }
    );

    if (!response.sucesso) {
        toast.error(
            response.erro?.mensagem ||
            "Erro ao verificar confirmação. Tente novamente."
        );
    }

    return response;
}

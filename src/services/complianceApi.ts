import {
    ValidationRequest,
    ValidationResponse,
    TipoSistema,
    ApiError
} from '../types/compliance';

const API_BASE_URL = '/api/v1/compliance';

/**
 * Valida um sistema hidráulico contra a norma NBR específica.
 * @param tipoSistema O tipo de sistema (esgoto, pluvial, etc.)
 * @param dados Objeto contendo os dados do formulário
 * @returns Promise com o resultado da validação
 * @throws Error com mensagem detalhada em caso de falha
 */
export async function validarSistema(
    tipoSistema: TipoSistema,
    dados: Record<string, unknown>
): Promise<ValidationResponse> {
    const payload: ValidationRequest = {
        tipo_sistema: tipoSistema,
        dados: dados
    };

    try {
        const response = await fetch(`${API_BASE_URL}/validar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: response.statusText }));

            const apiError: ApiError = {
                tipo: 'ERRO_INTERNO',
                status: response.status,
                body: errorBody
            };

            // Tenta categorizar o erro baseado no status ou body
            if (response.status === 400) apiError.tipo = 'PAYLOAD_INVALIDO';
            if (response.status === 422) apiError.tipo = 'VIOLACAO_NORMATIVA';

            throw apiError;
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na validação de compliance:', error);
        // Re-throw para ser tratado pelo hook/componente
        throw error;
    }
}

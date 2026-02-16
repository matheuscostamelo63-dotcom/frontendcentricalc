import { useState, useCallback } from 'react';
import {
    ValidationResponse,
    TipoSistema,
    ApiError
} from '../types/compliance';
import { validarSistema as apiValidarSistema } from '../services/complianceApi';

/**
 * Hook para gerenciar o estado da validação de compliance.
 */
export function useCompliance() {
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState<ValidationResponse | null>(null);
    const [erro, setErro] = useState<ApiError | null>(null);

    const validar = useCallback(async (tipo: TipoSistema, dados: Record<string, unknown>) => {
        setLoading(true);
        setErro(null);
        setResultado(null); // Limpa resultado anterior ao iniciar nova validação

        try {
            const resp = await apiValidarSistema(tipo, dados);
            setResultado(resp);
            return resp;
        } catch (err) {
            const apiError = err as ApiError;
            setErro(apiError);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const limpar = useCallback(() => {
        setResultado(null);
        setErro(null);
        setLoading(false);
    }, []);

    return {
        resultado,
        loading,
        erro,
        validar,
        limpar
    };
}

/**
 * Hook para gerenciar dados de formulário genéricos com tipagem segura.
 */
export function useFormState<T extends Record<string, unknown>>(initialState: T) {
    const [dados, setDados] = useState<T>(initialState);

    const handleChange = useCallback((key: keyof T, value: unknown) => {
        setDados(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const reset = useCallback(() => {
        setDados(initialState);
    }, [initialState]);

    return {
        dados,
        handleChange,
        setDados,
        reset
    };
}

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getTiposEdificacao,
  getTiposDistribuicao,
  calcularReservatorio as calcularAPI,
  validarReservatorio as validarAPI,
  ReservatorioError,
} from '@/services/reservatorioService';
import {
  TipoEdificacao,
  TipoDistribuicao,
  CalculoRequest,
  CalculoResponse,
  ValidacaoRequest,
  ValidacaoResponse,
} from '@/types/reservatorio';

interface ReservatorioState {
  tiposEdificacao: TipoEdificacao[];
  tiposDistribuicao: TipoDistribuicao[];
  isLoadingTipos: boolean;
  isCalculating: boolean;
  isValidating: boolean;
  error: string | null;
}

export const useReservatorio = () => {
  const [state, setState] = useState<ReservatorioState>({
    tiposEdificacao: [],
    tiposDistribuicao: [],
    isLoadingTipos: false,
    isCalculating: false,
    isValidating: false,
    error: null,
  });

  // Cache data loading
  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, isLoadingTipos: true, error: null }));
      try {
        const [edificacoes, distribuicoes] = await Promise.all([
          getTiposEdificacao(),
          getTiposDistribuicao(),
        ]);
        setState(prev => ({
          ...prev,
          tiposEdificacao: edificacoes,
          tiposDistribuicao: distribuicoes,
          error: null,
        }));
      } catch (err) {
        const message = err instanceof ReservatorioError ? err.message : "Erro desconhecido ao carregar dados iniciais.";
        setState(prev => ({ ...prev, error: message }));
        toast.error(message);
      } finally {
        setState(prev => ({ ...prev, isLoadingTipos: false }));
      }
    };

    loadData();
  }, []);

  const calcular = useCallback(async (dados: CalculoRequest): Promise<CalculoResponse> => {
    setState(prev => ({ ...prev, isCalculating: true, error: null }));
    try {
      const resultado = await calcularAPI(dados);
      toast.success("Cálculo de reservatório realizado com sucesso!");
      return resultado;
    } catch (err) {
      const message = err instanceof ReservatorioError ? err.message : "Falha ao calcular o volume do reservatório.";
      setState(prev => ({ ...prev, error: message }));
      toast.error(message);
      throw err;
    } finally {
      setState(prev => ({ ...prev, isCalculating: false }));
    }
  }, []);

  const validar = useCallback(async (dados: ValidacaoRequest): Promise<ValidacaoResponse> => {
    setState(prev => ({ ...prev, isValidating: true, error: null }));
    try {
      const resultado = await validarAPI(dados);
      toast.success("Validação concluída.");
      return resultado;
    } catch (err) {
      const message = err instanceof ReservatorioError ? err.message : "Falha ao validar o reservatório existente.";
      setState(prev => ({ ...prev, error: message }));
      toast.error(message);
      throw err;
    } finally {
      setState(prev => ({ ...prev, isValidating: false }));
    }
  }, []);

  return {
    ...state,
    calcular,
    validar,
  };
};
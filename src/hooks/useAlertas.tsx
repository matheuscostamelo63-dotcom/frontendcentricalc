import { useState, useCallback, useMemo } from "react";
import { Alerta } from "@/types/alertas";
import { confirmarAlertas, verificarConfirmacao } from "@/services/alertasService";
import { toast } from "sonner";

interface UseAlertasOptions {
    projetoId?: string;
    usuarioId?: string;
    calculoId?: string;
}

export const useAlertas = (alertas: Alerta[], options: UseAlertasOptions = {}) => {
    const [confirmando, setConfirmando] = useState(false);
    const [confirmado, setConfirmado] = useState(false);

    // Classificação de alertas por nível
    const alertasPorNivel = useMemo(() => {
        return {
            impeditivos: alertas.filter((a) => a.nivel === "IMPEDITIVO"),
            criticos: alertas.filter((a) => a.nivel === "CRITICO"),
            atencao: alertas.filter((a) => a.nivel === "ATENCAO"),
            info: alertas.filter((a) => a.nivel === "INFO"),
        };
    }, [alertas]);

    // Verificações de estado
    const temImpeditivo = useMemo(
        () => alertasPorNivel.impeditivos.length > 0,
        [alertasPorNivel.impeditivos]
    );

    const temCritico = useMemo(
        () => alertasPorNivel.criticos.length > 0,
        [alertasPorNivel.criticos]
    );

    const temAlertas = useMemo(() => alertas.length > 0, [alertas]);

    // Lógica de bloqueio
    const podeGerarPDF = useMemo(() => {
        if (temImpeditivo) return false;
        if (temCritico && !confirmado) return false;
        return true;
    }, [temImpeditivo, temCritico, confirmado]);

    const motivoBloqueio = useMemo(() => {
        if (temImpeditivo) {
            return "Existem alertas impeditivos que bloqueiam a geração do relatório. Corrija os problemas identificados antes de prosseguir.";
        }
        if (temCritico && !confirmado) {
            return "Existem alertas críticos que requerem sua confirmação antes de gerar o relatório.";
        }
        return null;
    }, [temImpeditivo, temCritico, confirmado]);

    // Função de confirmação de riscos
    const confirmarRiscos = useCallback(async () => {
        if (!options.projetoId || !options.usuarioId) {
            toast.error("Informações de projeto e usuário são necessárias para confirmar alertas");
            return false;
        }

        if (alertasPorNivel.criticos.length === 0) {
            toast.info("Não há alertas críticos para confirmar");
            return true;
        }

        setConfirmando(true);

        try {
            const response = await confirmarAlertas({
                projeto_id: options.projetoId,
                usuario_id: options.usuarioId,
                alertas_confirmados: alertasPorNivel.criticos.map((a) => a.tipo),
                termos_aceitos: true,
                calculo_id: options.calculoId,
            });

            if (response.sucesso) {
                setConfirmado(true);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            toast.error("Erro ao confirmar alertas. Tente novamente.");
            return false;
        } finally {
            setConfirmando(false);
        }
    }, [options, alertasPorNivel.criticos]);

    // Verificar confirmação existente
    const verificarConfirmacaoExistente = useCallback(async () => {
        if (!options.projetoId || !options.usuarioId) {
            return false;
        }

        try {
            const response = await verificarConfirmacao(
                options.projetoId,
                options.usuarioId
            );

            if (response.sucesso && response.dados) {
                setConfirmado(response.dados.confirmado);
                return response.dados.pode_gerar_pdf;
            }

            return false;
        } catch (error) {
            console.error("Erro ao verificar confirmação:", error);
            return false;
        }
    }, [options.projetoId, options.usuarioId]);

    return {
        // Estado
        alertas,
        alertasPorNivel,
        confirmando,
        confirmado,

        // Verificações
        temAlertas,
        temImpeditivo,
        temCritico,
        podeGerarPDF,
        motivoBloqueio,

        // Ações
        confirmarRiscos,
        verificarConfirmacaoExistente,
    };
};

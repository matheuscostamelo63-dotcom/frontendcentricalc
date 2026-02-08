import { useState } from "react";
import { Alerta } from "@/types/alertas";
import { AlertList } from "./AlertList";
import { AlertConfirmationDialog } from "./AlertConfirmationDialog";
import { useAlertas } from "@/hooks/useAlertas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Componente de exemplo mostrando integração completa do sistema de alertas V2
 * Este componente demonstra:
 * - Exibição de alertas após cálculo
 * - Bloqueio de ações baseado em nível de alerta
 * - Fluxo de confirmação para alertas críticos
 */

// Dados de exemplo para demonstração
const alertasExemplo: Alerta[] = [
    {
        id: "1",
        tipo: "VELOCIDADE_ALTA",
        nivel: "CRITICO",
        titulo: "Velocidade Acima do Limite",
        mensagem:
            "A velocidade calculada excede o limite máximo permitido pela NBR 5626",
        item_nbr: "6.2.3",
        norma: "NBR 5626:2020",
        url_doc: "https://www.abntcatalogo.com.br/norma.aspx?ID=436370",
        recomendacao_generica: [
            "Aumentar o diâmetro da tubulação",
            "Reduzir a vazão de projeto",
        ],
        recomendacao_personalizada:
            "Considere aumentar o diâmetro de 25mm para 32mm",
        impacto: "Ruído excessivo, desgaste prematuro da tubulação",
        detalhes_tecnicos: {
            valor_calculado: 3.5,
            unidade: "m/s",
            limite_norma: 3.0,
            excesso_percentual: 16.7,
            formula: "V = Q / A",
            valores_input: {
                vazao_m3h: 10.5,
                diametro_mm: 25,
            },
        },
    },
    {
        id: "2",
        tipo: "PRESSAO_BAIXA",
        nivel: "ATENCAO",
        titulo: "Pressão Próxima ao Limite Mínimo",
        mensagem: "A pressão estática está próxima do limite mínimo recomendado",
        item_nbr: "5.1.2",
        norma: "NBR 5626:2020",
        url_doc: "https://www.abntcatalogo.com.br/norma.aspx?ID=436370",
        recomendacao_generica: [
            "Verificar altura do reservatório",
            "Considerar sistema de pressurização",
        ],
        impacto: "Possível insuficiência de vazão em pontos elevados",
    },
    {
        id: "3",
        tipo: "DIAMETRO_OTIMO",
        nivel: "INFO",
        titulo: "Dimensionamento Adequado",
        mensagem: "O diâmetro selecionado está dentro dos parâmetros ideais",
        item_nbr: "6.2.1",
        norma: "NBR 5626:2020",
        url_doc: "https://www.abntcatalogo.com.br/norma.aspx?ID=436370",
        recomendacao_generica: ["Manter o dimensionamento atual"],
        impacto: "Nenhum",
    },
];

export const ExemploIntegracao = () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    // Hook de alertas com opções de projeto/usuário
    const {
        alertas,
        alertasPorNivel,
        confirmando,
        confirmado,
        temImpeditivo,
        temCritico,
        podeGerarPDF,
        motivoBloqueio,
        confirmarRiscos,
    } = useAlertas(alertasExemplo, {
        projetoId: "exemplo-projeto-123",
        usuarioId: "exemplo-usuario-456",
        calculoId: "exemplo-calculo-789",
    });

    const handleGerarRelatorio = () => {
        if (temImpeditivo) {
            toast.error(motivoBloqueio || "Não é possível gerar o relatório");
            return;
        }

        if (temCritico && !confirmado) {
            setDialogOpen(true);
            return;
        }

        // Simular geração de relatório
        toast.success("Relatório gerado com sucesso!");
    };

    const handleConfirmarRiscos = async () => {
        const sucesso = await confirmarRiscos();
        if (sucesso) {
            setDialogOpen(false);
            toast.success("Riscos confirmados. Você pode prosseguir com o relatório.");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Sistema de Alertas V2 - Exemplo</h1>
                <p className="text-muted-foreground">
                    Demonstração completa do sistema de alertas NBR 5626 com objetos
                    estruturados
                </p>
            </div>

            {/* Card de Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {podeGerarPDF ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                Projeto Pronto para Relatório
                            </>
                        ) : (
                            <>
                                <AlertCircle className="h-5 w-5 text-orange-600" />
                                Ação Necessária
                            </>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Total de Alertas:</span>
                            <span className="ml-2 font-bold">{alertas.length}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Impeditivos:</span>
                            <span className="ml-2 font-bold text-red-600">
                                {alertasPorNivel.impeditivos.length}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Críticos:</span>
                            <span className="ml-2 font-bold text-orange-600">
                                {alertasPorNivel.criticos.length}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Status:</span>
                            <span className="ml-2 font-bold">
                                {confirmado ? "Confirmado" : "Pendente"}
                            </span>
                        </div>
                    </div>

                    {motivoBloqueio && (
                        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 p-3 rounded text-sm">
                            <p className="font-medium text-orange-700 dark:text-orange-400">
                                {motivoBloqueio}
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={handleGerarRelatorio}
                        disabled={temImpeditivo}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <FileText className="h-4 w-4" />
                        Gerar Relatório PDF
                    </Button>
                </CardContent>
            </Card>

            {/* Lista de Alertas */}
            <AlertList alertas={alertas} showFilters={true} />

            {/* Dialog de Confirmação */}
            <AlertConfirmationDialog
                alertasCriticos={alertasPorNivel.criticos}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleConfirmarRiscos}
                isLoading={confirmando}
            />
        </div>
    );
};

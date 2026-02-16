import { Alerta, NivelAlerta } from "@/types/alertas";
import { AlertCard } from "./AlertCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Filter } from "lucide-react";
import { useSistema } from "@/context/SistemaContext";
import { filterAlertasPorNorma, getDescricaoNorma } from "@/services/complianceFilter";

interface AlertListProps {
    alertas: Alerta[];
    showFilters?: boolean;
}

export const AlertList = ({ alertas, showFilters = true }: AlertListProps) => {
    const { normaSelecionada } = useSistema();

    // Filter alerts based on selected norm
    const alertasFiltrados = normaSelecionada
        ? filterAlertasPorNorma(alertas, normaSelecionada)
        : alertas;

    if (alertasFiltrados.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                        {normaSelecionada
                            ? `Nenhum alerta identificado para ${normaSelecionada}`
                            : 'Nenhum alerta identificado'
                        }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Seu projeto está em conformidade com as normas técnicas
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Contar alertas por nível
    const contadores = alertasFiltrados.reduce(
        (acc, alerta) => {
            acc[alerta.nivel] = (acc[alerta.nivel] || 0) + 1;
            return acc;
        },
        {} as Record<NivelAlerta, number>
    );

    // Agrupar alertas por nível
    const alertasPorNivel = alertasFiltrados.reduce(
        (acc, alerta) => {
            if (!acc[alerta.nivel]) {
                acc[alerta.nivel] = [];
            }
            acc[alerta.nivel].push(alerta);
            return acc;
        },
        {} as Record<NivelAlerta, Alerta[]>
    );

    if (!showFilters) {
        return (
            <div className="space-y-3">
                {/* Active Filter Badge */}
                {normaSelecionada && (
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-blue-600" />
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Filtrando por: {normaSelecionada} - {getDescricaoNorma(normaSelecionada)}
                        </Badge>
                    </div>
                )}
                {alertasFiltrados.map((alerta) => (
                    <AlertCard key={alerta.id} alerta={alerta} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Active Filter Badge */}
            {normaSelecionada && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="py-3">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                                Filtrando alertas por: <strong>{normaSelecionada}</strong> - {getDescricaoNorma(normaSelecionada)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Resumo de Alertas */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Resumo de Alertas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {contadores.IMPEDITIVO && (
                            <Badge variant="destructive" className="gap-1">
                                <span className="font-bold">{contadores.IMPEDITIVO}</span>
                                Impeditivo{contadores.IMPEDITIVO > 1 ? "s" : ""}
                            </Badge>
                        )}
                        {contadores.CRITICO && (
                            <Badge variant="destructive" className="gap-1">
                                <span className="font-bold">{contadores.CRITICO}</span>
                                Crítico{contadores.CRITICO > 1 ? "s" : ""}
                            </Badge>
                        )}
                        {contadores.ATENCAO && (
                            <Badge variant="outline" className="gap-1">
                                <span className="font-bold">{contadores.ATENCAO}</span>
                                Atenção
                            </Badge>
                        )}
                        {contadores.INFO && (
                            <Badge variant="secondary" className="gap-1">
                                <span className="font-bold">{contadores.INFO}</span>
                                Info
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Tabs com Filtros */}
            <Tabs defaultValue="todos" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="todos">
                        Todos ({alertasFiltrados.length})
                    </TabsTrigger>
                    <TabsTrigger value="IMPEDITIVO" disabled={!contadores.IMPEDITIVO}>
                        Impeditivos ({contadores.IMPEDITIVO || 0})
                    </TabsTrigger>
                    <TabsTrigger value="CRITICO" disabled={!contadores.CRITICO}>
                        Críticos ({contadores.CRITICO || 0})
                    </TabsTrigger>
                    <TabsTrigger value="ATENCAO" disabled={!contadores.ATENCAO}>
                        Atenção ({contadores.ATENCAO || 0})
                    </TabsTrigger>
                    <TabsTrigger value="INFO" disabled={!contadores.INFO}>
                        Info ({contadores.INFO || 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="todos" className="space-y-3 mt-4">
                    {alertasFiltrados.map((alerta) => (
                        <AlertCard key={alerta.id} alerta={alerta} />
                    ))}
                </TabsContent>

                {(["IMPEDITIVO", "CRITICO", "ATENCAO", "INFO"] as NivelAlerta[]).map(
                    (nivel) => (
                        <TabsContent key={nivel} value={nivel} className="space-y-3 mt-4">
                            {alertasPorNivel[nivel]?.map((alerta) => (
                                <AlertCard key={alerta.id} alerta={alerta} />
                            )) || (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        Nenhum alerta de nível {nivel}
                                    </p>
                                )}
                        </TabsContent>
                    )
                )}
            </Tabs>
        </div>
    );
};

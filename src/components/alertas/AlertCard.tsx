import { Alerta, NivelAlerta } from "@/types/alertas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Info,
    AlertTriangle,
    AlertCircle,
    ShieldAlert,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { AlertDetailsModal } from "./AlertDetailsModal";

interface AlertCardProps {
    alerta: Alerta;
}

const nivelConfig: Record<
    NivelAlerta,
    {
        icon: React.ComponentType<{ className?: string }>;
        variant: "default" | "secondary" | "destructive" | "outline";
        bgColor: string;
        textColor: string;
    }
> = {
    INFO: {
        icon: Info,
        variant: "secondary",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        textColor: "text-blue-700 dark:text-blue-400",
    },
    ATENCAO: {
        icon: AlertTriangle,
        variant: "outline",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        textColor: "text-yellow-700 dark:text-yellow-400",
    },
    CRITICO: {
        icon: AlertCircle,
        variant: "destructive",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
        textColor: "text-orange-700 dark:text-orange-400",
    },
    IMPEDITIVO: {
        icon: ShieldAlert,
        variant: "destructive",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        textColor: "text-red-700 dark:text-red-400",
    },
};

export const AlertCard = ({ alerta }: AlertCardProps) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const config = nivelConfig[alerta.nivel];
    const Icon = config.icon;

    return (
        <>
            <Card className={`${config.bgColor} border-2`}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                            <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.textColor}`} />
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-semibold mb-1">
                                    {alerta.titulo}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {alerta.mensagem}
                                </p>
                            </div>
                        </div>
                        <Badge variant={config.variant} className="flex-shrink-0">
                            {alerta.nivel}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">
                            {alerta.norma} - Item {alerta.item_nbr}
                        </span>
                        {alerta.url_doc && (
                            <a
                                href={alerta.url_doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                                Ver documentação
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </div>

                    {alerta.impacto && (
                        <div className="text-sm">
                            <span className="font-medium">Impacto:</span>{" "}
                            <span className="text-muted-foreground">{alerta.impacto}</span>
                        </div>
                    )}

                    {alerta.recomendacao_generica.length > 0 && (
                        <div className="text-sm">
                            <span className="font-medium">Recomendações:</span>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                                {alerta.recomendacao_generica.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {alerta.recomendacao_personalizada && (
                        <div className="text-sm bg-background/50 p-2 rounded border">
                            <span className="font-medium">Recomendação Específica:</span>{" "}
                            <span className="text-muted-foreground">
                                {alerta.recomendacao_personalizada}
                            </span>
                        </div>
                    )}

                    {alerta.detalhes_tecnicos && (
                        <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-xs"
                            onClick={() => setDetailsOpen(true)}
                        >
                            Ver Detalhes Técnicos
                        </Button>
                    )}
                </CardContent>
            </Card>

            {alerta.detalhes_tecnicos && (
                <AlertDetailsModal
                    alerta={alerta}
                    open={detailsOpen}
                    onOpenChange={setDetailsOpen}
                />
            )}
        </>
    );
};

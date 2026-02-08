import { Alerta } from "@/types/alertas";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

interface AlertDetailsModalProps {
    alerta: Alerta;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AlertDetailsModal = ({
    alerta,
    open,
    onOpenChange,
}: AlertDetailsModalProps) => {
    const detalhes = alerta.detalhes_tecnicos;

    if (!detalhes) return null;

    const excessoFormatado =
        detalhes.excesso_percentual > 0
            ? `+${detalhes.excesso_percentual.toFixed(1)}%`
            : `${detalhes.excesso_percentual.toFixed(1)}%`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {alerta.titulo}
                        <Badge variant="outline">{alerta.nivel}</Badge>
                    </DialogTitle>
                    <DialogDescription>{alerta.mensagem}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Fórmula Aplicada */}
                    <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">Fórmula Aplicada</h4>
                        <code className="text-lg font-mono bg-background px-3 py-2 rounded border block text-center">
                            {detalhes.formula}
                        </code>
                    </div>

                    {/* Valores de Entrada */}
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Valores de Entrada</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(detalhes.valores_input).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="bg-muted/50 p-2 rounded text-sm flex justify-between"
                                >
                                    <span className="text-muted-foreground capitalize">
                                        {key.replace(/_/g, " ")}:
                                    </span>
                                    <span className="font-medium">
                                        {typeof value === "number" ? value.toFixed(2) : value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Comparação com Limite da Norma */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-muted-foreground mb-1">
                                Limite da Norma
                            </p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                {detalhes.limite_norma.toFixed(2)}
                                <span className="text-sm ml-1">{detalhes.unidade}</span>
                            </p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                            <p className="text-xs text-muted-foreground mb-1">
                                Valor Calculado
                            </p>
                            <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                                {detalhes.valor_calculado.toFixed(2)}
                                <span className="text-sm ml-1">{detalhes.unidade}</span>
                            </p>
                        </div>
                    </div>

                    {/* Excesso Percentual */}
                    <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Excesso Percentual:</span>
                            <span className="text-xl font-bold text-destructive">
                                {excessoFormatado}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Referência NBR */}
                    <div className="text-sm">
                        <p className="font-medium mb-1">Referência Normativa:</p>
                        <div className="flex items-center justify-between bg-muted p-3 rounded">
                            <span>
                                {alerta.norma} - Item {alerta.item_nbr}
                            </span>
                            {alerta.url_doc && (
                                <a
                                    href={alerta.url_doc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                                >
                                    Ver documentação
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Impacto */}
                    {alerta.impacto && (
                        <div className="text-sm">
                            <p className="font-medium mb-1">Impacto:</p>
                            <p className="text-muted-foreground bg-muted p-3 rounded">
                                {alerta.impacto}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

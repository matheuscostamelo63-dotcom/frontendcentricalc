import { Alerta } from "@/types/alertas";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface AlertConfirmationDialogProps {
    alertasCriticos: Alerta[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const AlertConfirmationDialog = ({
    alertasCriticos,
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
}: AlertConfirmationDialogProps) => {
    const [termosAceitos, setTermosAceitos] = useState(false);

    const handleConfirm = () => {
        if (termosAceitos) {
            onConfirm();
            setTermosAceitos(false); // Reset para próxima vez
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setTermosAceitos(false); // Reset ao fechar
        }
        onOpenChange(newOpen);
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Confirmação de Riscos Necessária
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Os seguintes alertas críticos foram identificados no seu projeto.
                        Para prosseguir, você deve estar ciente dos riscos e aceitar os
                        termos.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-3 my-4">
                    {alertasCriticos.map((alerta) => (
                        <div
                            key={alerta.id}
                            className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 p-3 rounded-lg"
                        >
                            <div className="flex items-start gap-2 mb-2">
                                <Badge variant="destructive" className="flex-shrink-0">
                                    {alerta.nivel}
                                </Badge>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm">{alerta.titulo}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {alerta.mensagem}
                                    </p>
                                </div>
                            </div>
                            {alerta.impacto && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    <span className="font-medium">Impacto:</span> {alerta.impacto}
                                </p>
                            )}
                            {alerta.recomendacao_personalizada && (
                                <p className="text-xs bg-background/50 p-2 rounded mt-2">
                                    <span className="font-medium">Recomendação:</span>{" "}
                                    {alerta.recomendacao_personalizada}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-start space-x-2 bg-muted p-4 rounded-lg">
                    <Checkbox
                        id="termos"
                        checked={termosAceitos}
                        onCheckedChange={(checked) => setTermosAceitos(checked === true)}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor="termos"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            Estou ciente dos riscos identificados
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Declaro que li e compreendi os alertas críticos acima e assumo a
                            responsabilidade de prosseguir com o projeto mesmo com os riscos
                            identificados.
                        </p>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={!termosAceitos || isLoading}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isLoading ? "Confirmando..." : "Confirmar e Prosseguir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

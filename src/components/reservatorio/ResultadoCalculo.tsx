import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculoResponse } from '@/types/reservatorio';
import { Check, FireExtinguisher, Droplet, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ResultadoCalculoProps {
  dados: CalculoResponse;
  onValidar: () => void;
  onNovoCalculo: () => void;
}

export const ResultadoCalculo = ({ dados, onValidar, onNovoCalculo }: ResultadoCalculoProps) => {
  if (!dados) return null;

  const {
    consumo_diario_m3,
    volume_minimo_m3,
    reserva_incendio_m3,
    volume_total_m3,
    volume_superior_m3,
    volume_inferior_m3,
    percentual_superior,
    percentual_inferior,
    observacoes,
  } = dados;

  return (
    <Card className="shadow-lg border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Droplet className="h-6 w-6 text-primary" />
          Resultado do Cálculo de Volume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-secondary p-4 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Consumo Diário</div>
            <div className="text-2xl font-bold text-foreground">
              {consumo_diario_m3.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">m³</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {(consumo_diario_m3 * 1000).toFixed(0)} L
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Volume Útil (Mínimo)</div>
            <div className="text-2xl font-bold text-primary">
              {volume_minimo_m3.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">m³</span>
            </div>
          </div>

          {reserva_incendio_m3 > 0 && (
            <div className="bg-warning/20 p-4 rounded-lg text-center border border-warning">
              <div className="text-sm text-warning-foreground flex items-center justify-center gap-1">
                <FireExtinguisher className="h-4 w-4" /> Reserva Incêndio
              </div>
              <div className="text-2xl font-bold text-warning-foreground">
                {reserva_incendio_m3.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">m³</span>
              </div>
            </div>
          )}

          <div className={cn("p-4 rounded-lg text-center", reserva_incendio_m3 > 0 ? "bg-success/20 border border-success" : "bg-primary/20 border border-primary")}>
            <div className="text-sm font-semibold text-foreground">VOLUME TOTAL</div>
            <div className="text-3xl font-extrabold text-primary">
              {volume_total_m3.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">m³</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Distribuição */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Distribuição do Reservatório</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Superior */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Superior ({percentual_superior.toFixed(1)}%)</span>
                <span>{volume_superior_m3.toFixed(2)} m³</span>
              </div>
              <div className="h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${percentual_superior}%` }}
                ></div>
              </div>
            </div>

            {/* Inferior */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Inferior ({percentual_inferior.toFixed(1)}%)</span>
                <span>{volume_inferior_m3.toFixed(2)} m³</span>
              </div>
              <div className="h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${percentual_inferior}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        {observacoes && observacoes.length > 0 && (
          <div className="p-4 border-l-4 border-success bg-success/10 rounded-md">
            <h4 className="font-semibold text-success mb-2">Observações Técnicas</h4>
            <ul className="list-disc list-inside text-sm text-success-foreground/90 space-y-1 ml-4">
              {observacoes.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-4 pt-4 flex-wrap">
          <Button
            className="flex-1 min-w-[150px] gap-2"
            onClick={onValidar}
          >
            <Check className="h-4 w-4" />
            Validar Volume Existente
          </Button>
          <Button
            variant="outline"
            className="flex-1 min-w-[150px] gap-2"
            onClick={onNovoCalculo}
          >
            <RefreshCw className="h-4 w-4" />
            Novo Cálculo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
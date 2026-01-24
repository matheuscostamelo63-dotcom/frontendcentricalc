import React, { useState } from 'react';
import { CalculoReservatorio } from './CalculoReservatorio';
import { ResultadoCalculo } from './ResultadoCalculo';
import { ValidacaoReservatorio } from './ValidacaoReservatorio';
import { ResultadoValidacao } from './ResultadoValidacao';
import { CalculoResponse, ValidacaoResponse } from '@/types/reservatorio';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Step = 'CALCULO' | 'RESULTADO' | 'VALIDACAO' | 'VALIDACAO_RESULTADO';

export const ReservatorioContainer = () => {
  const [step, setStep] = useState<Step>('CALCULO');
  const [calculoResult, setCalculoResult] = useState<CalculoResponse | null>(null);
  const [validacaoResult, setValidacaoResult] = useState<ValidacaoResponse | null>(null);

  const handleCalculoResultado = (resultado: CalculoResponse) => {
    setCalculoResult(resultado);
    setValidacaoResult(null); // Reset validation if calculation changes
    setStep('RESULTADO');
  };

  const handleValidar = () => {
    if (calculoResult) {
      setValidacaoResult(null);
      setStep('VALIDACAO');
    }
  };

  const handleValidacaoResultado = (resultado: ValidacaoResponse) => {
    setValidacaoResult(resultado);
    setStep('VALIDACAO_RESULTADO');
  };

  const handleNovoCalculo = () => {
    setCalculoResult(null);
    setValidacaoResult(null);
    setStep('CALCULO');
  };

  const volumeNecessario = calculoResult?.volume_total_m3 || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
      {/* Coluna Principal (Formulários) */}
      <div className="lg:col-span-2 space-y-6">
        {step === 'CALCULO' && (
          <CalculoReservatorio onResultado={handleCalculoResultado} />
        )}
        
        {step === 'RESULTADO' && calculoResult && (
          <ResultadoCalculo 
            dados={calculoResult} 
            onValidar={handleValidar} 
            onNovoCalculo={handleNovoCalculo} 
          />
        )}

        {step === 'VALIDACAO' && volumeNecessario > 0 && (
          <ValidacaoReservatorio 
            volumeNecessario={volumeNecessario} 
            onResultado={handleValidacaoResultado} 
          />
        )}
      </div>

      {/* Coluna Lateral (Resumo/Resultados Secundários) */}
      <div className="lg:col-span-1 space-y-6">
        {/* Exibe o resultado da validação se estiver disponível */}
        {validacaoResult && (
          <ResultadoValidacao 
            dados={validacaoResult} 
            onRecalcular={handleNovoCalculo} 
          />
        )}

        {/* Exibe o resumo do cálculo se estiver disponível e não estiver no passo de resultado principal */}
        {calculoResult && step !== 'RESULTADO' && (
            <Card className="p-4 border-l-4 border-primary/50">
                <h4 className="font-semibold text-lg mb-2">Resumo do Cálculo</h4>
                <Separator className="mb-3" />
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume Útil:</span>
                        <span className="font-medium">{calculoResult.volume_minimo_m3.toFixed(2)} m³</span>
                    </div>
                    {calculoResult.reserva_incendio_m3 > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Reserva Incêndio:</span>
                            <span className="font-medium text-warning-foreground">{calculoResult.reserva_incendio_m3.toFixed(2)} m³</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-primary pt-2 border-t border-border/50">
                        <span>TOTAL NECESSÁRIO:</span>
                        <span>{calculoResult.volume_total_m3.toFixed(2)} m³</span>
                    </div>
                </div>
                <Button variant="link" size="sm" onClick={() => setStep('RESULTADO')} className="p-0 h-auto mt-3">
                    Ver Detalhes
                </Button>
            </Card>
        )}

        {/* Mensagem de instrução inicial */}
        {!calculoResult && step === 'CALCULO' && (
            <Card className="p-4 bg-muted">
                <h4 className="font-semibold mb-2">Instruções</h4>
                <p className="text-sm text-muted-foreground">
                    Preencha o formulário ao lado para calcular o volume mínimo do reservatório de acordo com a NBR 5626.
                </p>
            </Card>
        )}
      </div>
    </div>
  );
};
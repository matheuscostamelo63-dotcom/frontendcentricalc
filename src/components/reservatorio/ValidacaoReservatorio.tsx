import React, { useState } from 'react';
import { useReservatorio } from '@/hooks/useReservatorio';
import { validarValidacaoForm } from '@/utils/reservatorioValidation';
import { ValidacaoRequest, ValidacaoResponse } from '@/types/reservatorio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidacaoReservatorioProps {
  volumeNecessario: number;
  onResultado: (resultado: ValidacaoResponse) => void;
}

export const ValidacaoReservatorio = ({ volumeNecessario, onResultado }: ValidacaoReservatorioProps) => {
  const { validar, isValidating } = useReservatorio();

  const [formData, setFormData] = useState<ValidacaoRequest>({
    tipo_sistema: 'predial',
    volume_existente_m3: 0,
    volume_necessario_m3: volumeNecessario,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(parsedValue) ? value : parsedValue,
    } as ValidacaoRequest)); // Cast needed due to dynamic name

    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure numbers are passed to validation
    const dataToValidate: ValidacaoRequest = {
        ...formData,
        volume_existente_m3: Number(formData.volume_existente_m3),
        volume_necessario_m3: Number(formData.volume_necessario_m3),
    }

    const validacao = validarValidacaoForm(dataToValidate);
    if (!validacao.valido) {
      setFormError(validacao.erro);
      return;
    }

    try {
      const resultado = await validar(dataToValidate);
      onResultado(resultado);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Validação de Reservatório Existente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="tipo_sistema" value="predial" />

          <div className="space-y-2">
            <Label htmlFor="volume_necessario">
              Volume Necessário (m³) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="volume_necessario"
              type="number"
              name="volume_necessario_m3"
              value={volumeNecessario.toFixed(2)}
              readOnly
              className="bg-muted cursor-default font-medium"
              placeholder="Preenchido automaticamente"
            />
            <p className="text-xs text-muted-foreground">
              Valor calculado na etapa anterior (somente leitura)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume_existente">
              Volume Existente (m³) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="volume_existente"
              type="number"
              name="volume_existente_m3"
              value={formData.volume_existente_m3 === 0 ? "" : formData.volume_existente_m3}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
              placeholder="Ex: 70.0"
            />
            <p className="text-xs text-muted-foreground">
              Informe o volume atual do reservatório instalado
            </p>
          </div>

          {formError && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Erro:</strong> {formError}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Validar Reservatório
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
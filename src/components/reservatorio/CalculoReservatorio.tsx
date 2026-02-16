import React, { useState } from 'react';
import { useReservatorio } from '@/hooks/useReservatorio';
import { useSistema } from '@/context/SistemaContext';
import { validarCalculoForm } from '@/utils/reservatorioValidation';
import { CalculoRequest, CalculoResponse } from '@/types/reservatorio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculoReservatorioProps {
  onResultado: (resultado: CalculoResponse) => void;
}

export const CalculoReservatorio = ({ onResultado }: CalculoReservatorioProps) => {
  const { tipoSistema } = useSistema();

  const { tiposEdificacao, tiposDistribuicao, isLoadingTipos, isCalculating, error, calcular } =
    useReservatorio();

  // Initial state based on CalculoRequest, using string/number for inputs
  const [formData, setFormData] = useState<Omit<CalculoRequest, 'tipo_sistema'>>({
    tipo_edificacao: '',
    populacao: 0,
    autonomia_dias: 2.0,
    tipo_distribuicao: '',
    reserva_incendio_m3: 0,
    consumo_manual_m3: 0,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);

    setFormData(prev => ({
      ...prev,
      [name]: isNaN(parsedValue) ? value : parsedValue,
    } as Omit<CalculoRequest, 'tipo_sistema'>));

    if (formError) setFormError(null);
  };

  const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for validation and API call, ensuring numbers are numbers
    const dataToValidate: CalculoRequest = {
      tipo_sistema: 'agua_fria',
      tipo_edificacao: String(formData.tipo_edificacao),
      populacao: Number(formData.populacao),
      autonomia_dias: Number(formData.autonomia_dias),
      tipo_distribuicao: String(formData.tipo_distribuicao),
      reserva_incendio_m3: Number(formData.reserva_incendio_m3) || undefined,
      consumo_manual_m3: Number(formData.consumo_manual_m3) || undefined,
    };

    // Client-side validation
    const validacao = validarCalculoForm(dataToValidate, tiposEdificacao, tiposDistribuicao);
    if (!validacao.valido) {
      setFormError(validacao.erro);
      return;
    }

    try {
      const resultado = await calcular(dataToValidate);
      onResultado(resultado);
    } catch (err) {
      // Error handled by hook, just display locally if needed
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular';
      setFormError(errorMessage);
    }
  };

  const mostrarConsumManual = formData.tipo_edificacao === 'manual';
  const isReady = !isLoadingTipos && tiposEdificacao.length > 0;

  // Garante que isso SÓ roda para agua_fria (NBR 5626) (moved after hooks)
  if (tipoSistema !== 'agua_fria') {
    return null;
  }

  if (isLoadingTipos) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando dados...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          <strong>Erro de Carregamento:</strong> {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Cálculo de Volume de Reservatório (NBR 5626)</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Tipo Edificação */}
          <div className="space-y-2">
            <Label htmlFor="tipo_edificacao">
              Tipo de Edificação <span className="text-destructive">*</span>
            </Label>
            <Select
              value={String(formData.tipo_edificacao)}
              onValueChange={(value) => handleSelectChange('tipo_edificacao', value)}
              disabled={isCalculating || !isReady}
            >
              <SelectTrigger id="tipo_edificacao">
                <SelectValue placeholder="-- Selecione --" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(tiposEdificacao) && tiposEdificacao.map((tipo, index) => (
                  <SelectItem key={`edificacao-${tipo.chave}-${index}`} value={String(tipo.chave)}>
                    {tipo.nome} ({tipo.consumo_per_capita_litros} L/pessoa/dia)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consumo Manual - CONDICIONAL */}
          {mostrarConsumManual && (
            <div className="space-y-2 p-4 border-l-4 border-accent bg-accent/10 rounded-md">
              <Label htmlFor="consumo_manual">
                Consumo Diário Manual (m³) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="consumo_manual"
                type="number"
                name="consumo_manual_m3"
                value={formData.consumo_manual_m3 === 0 ? "" : formData.consumo_manual_m3}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                required={mostrarConsumManual}
                placeholder="Ex: 50.0"
              />
              <p className="text-xs text-muted-foreground">
                Você selecionou consumo manual. Informe o valor customizado.
              </p>
            </div>
          )}

          {/* População */}
          <div className="space-y-2">
            <Label htmlFor="populacao">
              População (pessoas) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="populacao"
              type="number"
              name="populacao"
              value={formData.populacao === 0 ? "" : formData.populacao}
              onChange={handleChange}
              min="1"
              step="1"
              required
              placeholder="Ex: 120"
            />
          </div>

          {/* Autonomia */}
          <div className="space-y-2">
            <Label htmlFor="autonomia_dias">
              Autonomia (dias) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="autonomia_dias"
              type="number"
              name="autonomia_dias"
              value={formData.autonomia_dias === 0 ? "" : formData.autonomia_dias}
              onChange={handleChange}
              min="0.5"
              max="5.0"
              step="0.5"
              required
              placeholder="Ex: 2.0"
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 0.5 dias, máximo 5.0 dias
            </p>
          </div>

          {/* Tipo Distribuição */}
          <div className="space-y-2">
            <Label htmlFor="tipo_distribuicao">
              Tipo de Distribuição <span className="text-destructive">*</span>
            </Label>
            <Select
              value={String(formData.tipo_distribuicao)}
              onValueChange={(value) => handleSelectChange('tipo_distribuicao', value)}
              disabled={isCalculating || !isReady}
            >
              <SelectTrigger id="tipo_distribuicao">
                <SelectValue placeholder="-- Selecione --" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(tiposDistribuicao) && tiposDistribuicao.map((tipo, index) => (
                  <SelectItem key={`distribuicao-${tipo.chave}-${index}`} value={String(tipo.chave)}>
                    {tipo.nome} - {tipo.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reserva Incêndio */}
          <div className="space-y-2">
            <Label htmlFor="reserva_incendio">
              Reserva para Incêndio (m³) - Opcional
            </Label>
            <Input
              id="reserva_incendio"
              type="number"
              name="reserva_incendio_m3"
              value={formData.reserva_incendio_m3 === 0 ? "" : formData.reserva_incendio_m3}
              onChange={handleChange}
              min="0"
              step="0.1"
              placeholder="Ex: 15 (deixe vazio se não aplicável)"
            />
            <p className="text-xs text-muted-foreground">
              Se informado, será adicionado ao volume total
            </p>
          </div>

          {/* Erro do Formulário */}
          {formError && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Erro:</strong> {formError}
              </AlertDescription>
            </Alert>
          )}

          {/* Botão Submit */}
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isCalculating || !isReady}
          >
            {isCalculating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                Calcular Volume
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
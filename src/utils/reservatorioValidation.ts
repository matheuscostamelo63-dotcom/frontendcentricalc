import { CalculoRequest, TipoEdificacao, TipoDistribuicao, ValidacaoRequest } from "@/types/reservatorio";

interface ValidationResult {
  valido: boolean;
  erro: string | null;
}

export function validarCalculoForm(
  formData: CalculoRequest,
  tiposEdificacao: TipoEdificacao[],
  tiposDistribuicao: TipoDistribuicao[]
): ValidationResult {
  const {
    tipo_edificacao,
    populacao,
    autonomia_dias,
    tipo_distribuicao,
    reserva_incendio_m3,
    consumo_manual_m3,
  } = formData;

  // 1. Tipo de Edificação
  if (!tipo_edificacao) {
    return { valido: false, erro: "Selecione o Tipo de Edificação." };
  }
  const selectedEdificacao = tiposEdificacao.find(t => t.chave === tipo_edificacao);
  if (!selectedEdificacao) {
    return { valido: false, erro: "Tipo de Edificação inválido." };
  }

  // 2. População
  const pop = Number(populacao);
  if (isNaN(pop) || pop < 1) {
    return { valido: false, erro: "População deve ser um número inteiro positivo." };
  }

  // 3. Autonomia
  const autonomia = Number(autonomia_dias);
  if (isNaN(autonomia) || autonomia < 0.5 || autonomia > 5.0) {
    return { valido: false, erro: "Autonomia deve estar entre 0.5 e 5.0 dias." };
  }

  // 4. Tipo de Distribuição
  if (!tipo_distribuicao) {
    return { valido: false, erro: "Selecione o Tipo de Distribuição." };
  }

  // 5. Consumo Manual (Condicional)
  if (tipo_edificacao === 'manual') {
    const consumoManual = Number(consumo_manual_m3);
    if (isNaN(consumoManual) || consumoManual <= 0.1) {
      return { valido: false, erro: "Informe um Consumo Diário Manual válido (m³)." };
    }
  }

  // 6. Reserva Incêndio (Opcional, mas deve ser >= 0 se preenchido)
  if (reserva_incendio_m3 !== undefined && reserva_incendio_m3 !== null && String(reserva_incendio_m3) !== "") {
    const reserva = Number(reserva_incendio_m3);
    if (isNaN(reserva) || reserva < 0) {
      return { valido: false, erro: "Reserva para Incêndio deve ser um valor não negativo." };
    }
  }

  return { valido: true, erro: null };
}

export function validarValidacaoForm(formData: ValidacaoRequest): ValidationResult {
  const { volume_existente_m3, volume_necessario_m3 } = formData;

  // 1. Volume Necessário (deve vir preenchido do cálculo)
  const necessario = Number(volume_necessario_m3);
  if (isNaN(necessario) || necessario <= 0) {
    return { valido: false, erro: "Volume Necessário inválido. Recalcule o volume primeiro." };
  }

  // 2. Volume Existente
  const existente = Number(volume_existente_m3);
  if (isNaN(existente) || existente < 0) {
    return { valido: false, erro: "Volume Existente deve ser um valor não negativo." };
  }

  return { valido: true, erro: null };
}
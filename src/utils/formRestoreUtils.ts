/**
 * Utilitário para restaurar o FormDataInput a partir de um CalculationInput (formato da API).
 *
 * Contexto: ao salvar um projeto, os dados são convertidos para a unidade da API antes do envio:
 *   - Q        : m³/s  (form usa m³/h)
 *   - viscosidade: Pa·s (form usa cP)
 *   - D (trecho): m    (form usa mm)
 *   - componentes: string[] flat (form usa {id, count}[])
 *
 * Esta função inverte essas conversões para pré-preencher o formulário ao corrigir um projeto.
 */

import { conversions, CalculationInput, PipeSection } from "@/lib/api";
import { FormDataInput, FormPipeSection } from "@/pages/Index";

/** Converte o array plano de IDs de componentes em { id, count }[] agrupado */
function groupComponentIds(ids: string[]): { id: string; count: number }[] {
  const counts: Record<string, number> = {};
  ids.forEach((id) => {
    counts[id] = (counts[id] ?? 0) + 1;
  });
  return Object.entries(counts).map(([id, count]) => ({ id, count }));
}

/** Converte um PipeSection da API para FormPipeSection (unidades do formulário) */
function apiPipeSectionToForm(section: PipeSection): FormPipeSection {
  const hasManualK =
    section.k_manual !== undefined && section.k_manual !== null;
  const hasComponents =
    Array.isArray(section.componentes) && section.componentes.length > 0;

  return {
    L: section.L,
    D: conversions.mToMm(section.D),
    material: section.material,
    rugosidade_mm: section.rugosidade_mm,
    conexoes: section.conexoes ?? 0,
    k_manual: hasManualK ? section.k_manual : undefined,
    componentes: hasComponents
      ? groupComponentIds(section.componentes as string[])
      : [],
    lossMode: hasManualK ? "manual" : "detailed",
  };
}

/**
 * Converte um CalculationInput (formato da API, salvo no projeto) de volta para
 * FormDataInput (formato do formulário, com unidades de exibição).
 */
export function apiInputToFormData(apiInput: CalculationInput): FormDataInput {
  return {
    name: apiInput.name ?? "",
    usuario: apiInput.usuario ?? "",

    // Q: m³/s → m³/h
    Q: conversions.m3sToM3h(apiInput.Q),

    // NPSHr: já está em mca, sem conversão
    NPSHr: apiInput.NPSHr ?? "",

    fluido: {
      densidade: apiInput.fluido?.densidade ?? 998,
      // viscosidade: Pa·s → cP
      viscosidade: conversions.pasToCp(apiInput.fluido?.viscosidade ?? 0.001),
      temperatura: apiInput.fluido?.temperatura ?? 20,
      // pressao_atm: já está em Pa no formData (exibe em kPa, mas armazena em Pa)
      pressao_atm: apiInput.fluido?.pressao_atm ?? 101325,
    },

    suc: (apiInput.suc ?? []).map((s) => ({
      succao_id: s.succao_id,
      tipo_reservatorio: s.tipo_reservatorio,
      nivel_nominal: s.nivel_nominal ?? 0,
      nivel_min: s.nivel_min ?? 0,
      nivel_max: s.nivel_max ?? 0,
      pressao_manometrica: s.pressao_manometrica ?? undefined,
      trechos: (s.trechos ?? []).map(apiPipeSectionToForm),
    })),

    recalque: (apiInput.recalque ?? []).map((r) => ({
      destino_id: r.destino_id,
      tipo_reservatorio: r.tipo_reservatorio,
      nivel_nominal: r.nivel_nominal ?? 0,
      nivel_min: r.nivel_min ?? 0,
      nivel_max: r.nivel_max ?? 0,
      pressao_manometrica: r.pressao_manometrica ?? undefined,
      trechos: (r.trechos ?? []).map(apiPipeSectionToForm),
    })),
  };
}

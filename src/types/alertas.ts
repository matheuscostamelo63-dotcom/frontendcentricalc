/**
 * Sistema de Alertas V2 - NBR 5626
 * Tipos TypeScript para alertas estruturados com metadados técnicos
 */

export type NivelAlerta = "INFO" | "ATENCAO" | "CRITICO" | "IMPEDITIVO";

export interface DetalhesTecnicos {
    valor_calculado: number;
    unidade: string;
    limite_norma: number;
    excesso_percentual: number; // Ex: 10.5 para 10.5% acima do limite
    formula: string; // Ex: "V = Q / A"
    valores_input: Record<string, any>; // Inputs usados (ex: { vazao_m3h: 10 })
}

export interface Alerta {
    id: string; // UUID único do alerta gerado
    tipo: string; // Código (ex: "CAVITACAO", "VELOCIDADE_ALTA")
    nivel: NivelAlerta;
    titulo: string; // Ex: "Risco de Cavitação"
    mensagem: string; // Mensagem formatada
    item_nbr: string; // Ex: "6.3.1"
    norma: string; // Ex: "NBR 5626:2020"
    url_doc: string; // Link para documentação
    recomendacao_generica: string[];
    recomendacao_personalizada?: string;
    detalhes_tecnicos?: DetalhesTecnicos;
    impacto: string; // Ex: "Dano à bomba, ruído"
}

export interface ConfirmacaoPayload {
    projeto_id: string;
    usuario_id: string;
    alertas_confirmados: string[]; // Lista de códigos (alerta.tipo)
    termos_aceitos: boolean; // Deve ser true
    calculo_id?: string; // Opcional
}

export interface VerificacaoConfirmacaoResponse {
    confirmado: boolean;
    pode_gerar_pdf: boolean;
}

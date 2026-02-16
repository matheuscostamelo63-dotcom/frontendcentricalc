import { TipoSistema } from '../types/compliance';

export interface CampoFormulario {
    key: string;
    label: string;
    tipo: 'number' | 'select' | 'text';
    obrigatorio: boolean;
    min?: number;
    max?: number;
    step?: number;
    opcoes?: Array<{ value: string | number; label: string }>;
    unidade?: string;
    placeholder?: string;
}

export interface ConfigSistema {
    norma: string;
    titulo: string;
    icone: string; // Emoji character for now
    campos: CampoFormulario[];
}

export const COMPLIANCE_FIELDS: Record<TipoSistema, ConfigSistema> = {
    esgoto: {
        norma: 'NBR 8160',
        titulo: 'Esgoto Sanitário',
        icone: '🚰',
        campos: [
            {
                key: 'diametro_mm',
                label: 'Diâmetro Nominal',
                tipo: 'select',
                obrigatorio: true,
                unidade: 'mm',
                opcoes: [
                    { value: 40, label: 'DN 40' },
                    { value: 50, label: 'DN 50' },
                    { value: 75, label: 'DN 75' },
                    { value: 100, label: 'DN 100' },
                    { value: 150, label: 'DN 150' },
                ]
            },
            {
                key: 'vazao_ls',
                label: 'Vazão de Projeto',
                tipo: 'number',
                obrigatorio: true,
                unidade: 'L/s',
                min: 0,
                step: 0.1,
                placeholder: 'Ex: 2.0'
            },
            {
                key: 'declividade_percent',
                label: 'Declividade',
                tipo: 'number',
                obrigatorio: true,
                unidade: '%',
                min: 0,
                max: 50,
                step: 0.1,
                placeholder: 'Ex: 1.0'
            },
            {
                key: 'material',
                label: 'Material da Tubulação',
                tipo: 'select',
                obrigatorio: true,
                opcoes: [
                    { value: 'pvc', label: 'PVC' },
                    { value: 'ferro_fundido', label: 'Ferro Fundido' },
                    { value: 'concreto', label: 'Concreto' }
                ]
            }
        ]
    },
    pluvial: {
        norma: 'NBR 10844',
        titulo: 'Águas Pluviais',
        icone: '🌧️',
        campos: [
            {
                key: 'area_cobertura_m2',
                label: 'Área de Cobertura',
                tipo: 'number',
                obrigatorio: true,
                unidade: 'm²',
                min: 0,
                placeholder: 'Ex: 150'
            },
            {
                key: 'intensidade_pluviometrica',
                label: 'Intensidade Pluviométrica',
                tipo: 'number',
                obrigatorio: true,
                unidade: 'mm/h',
                min: 0,
                placeholder: 'Ex: 150'
            },
            {
                key: 'periodo_retorno_anos',
                label: 'Período de Retorno',
                tipo: 'select',
                obrigatorio: true,
                opcoes: [
                    { value: 1, label: '1 ano' },
                    { value: 5, label: '5 anos' },
                    { value: 25, label: '25 anos' },
                ]
            }
        ]
    },
    incendio: {
        norma: 'NBR 13714',
        titulo: 'Hidrantes e Mangotinhos',
        icone: '🔥',
        campos: [
            {
                key: 'risco',
                label: 'Classificação de Risco',
                tipo: 'select',
                obrigatorio: true,
                opcoes: [
                    { value: 'leve', label: 'Leve' },
                    { value: 'medio', label: 'Médio' },
                    { value: 'elevado', label: 'Elevado' }
                ]
            },
            {
                key: 'numero_hidrantes',
                label: 'Número de Hidrantes',
                tipo: 'number',
                obrigatorio: true,
                min: 1,
                step: 1
            },
            {
                key: 'vazao_minima_litros',
                label: 'Vazão Mínima por Hidrante',
                tipo: 'number',
                obrigatorio: true,
                unidade: 'L/min',
                min: 0
            }
        ]
    },
    efluentes: {
        norma: 'NBR 13969',
        titulo: 'Tratamento de Efluentes',
        icone: '🧪',
        campos: [
            {
                key: 'volume_diario',
                label: 'Volume Diário de Efluente',
                tipo: 'number',
                obrigatorio: true,
                unidade: 'L/dia',
                min: 0
            },
            {
                key: 'tipo_tratamento',
                label: 'Tipo de Tratamento',
                tipo: 'select',
                obrigatorio: true,
                opcoes: [
                    { value: 'fossa_septica', label: 'Fossa Séptica' },
                    { value: 'filtro_anaerobio', label: 'Filtro Anaeróbio' },
                    { value: 'lagoa', label: 'Lagoa de Estabilização' }
                ]
            }
        ]
    },
    agua_fria: {
        norma: 'NBR 5626',
        titulo: 'Água Fria',
        icone: '💧',
        campos: [
            {
                key: 'pontos_utilizacao',
                label: 'Número de Pontos',
                tipo: 'number',
                obrigatorio: true,
                min: 1
            },
            {
                key: 'pressao_disponivel',
                label: 'Pressão Disponível',
                tipo: 'number',
                obrigatorio: true,
                unidade: 'm.c.a',
                min: 0
            }
        ]
    }
};

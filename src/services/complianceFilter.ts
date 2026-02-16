import { Alerta } from '@/types/alertas';
import { TIPO_SISTEMA_TO_NORMA } from '@/context/SistemaContext';
import { TipoSistema } from '@/services/vazaoService';

/**
 * Filter alerts based on the selected NBR standard
 * @param alertas - Array of all alerts
 * @param norma - NBR standard to filter by (e.g., "NBR 5626")
 * @returns Filtered array of alerts matching the norm
 */
export function filterAlertasPorNorma(
    alertas: Alerta[],
    norma: string | null
): Alerta[] {
    if (!norma) return alertas;

    // Filter alerts where the norma field starts with the selected norm
    // This handles cases like "NBR 5626:2020" matching "NBR 5626"
    return alertas.filter(alerta =>
        alerta.norma.startsWith(norma)
    );
}

/**
 * Get the NBR standard from a system type
 * @param tipo - System type (agua_fria, esgoto, etc.)
 * @returns NBR standard string (e.g., "NBR 5626")
 */
export function getNormaFromTipoSistema(tipo: TipoSistema): string {
    return TIPO_SISTEMA_TO_NORMA[tipo];
}

/**
 * Get a human-readable description of the norm
 * @param norma - NBR standard (e.g., "NBR 5626")
 * @returns Description string
 */
export function getDescricaoNorma(norma: string): string {
    const descricoes: Record<string, string> = {
        'NBR 5626': 'Sistemas Prediais de Água Fria',
        'NBR 8160': 'Sistemas Prediais de Esgoto Sanitário',
        'NBR 10844': 'Instalações Prediais de Águas Pluviais',
        'NBR 13714': 'Sistemas de Hidrantes e Mangotinhos',
        'NBR 13969': 'Tanques Sépticos - Unidades de Tratamento'
    };

    return descricoes[norma] || norma;
}

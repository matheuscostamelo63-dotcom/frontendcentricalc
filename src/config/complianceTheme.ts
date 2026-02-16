
export const COMPLIANCE_THEME = {
    colors: {
        conforme: {
            bg: '#f0fdf4', // green-50
            border: '#22c55e', // green-500
            text: '#166534', // green-800
        },
        naoConforme: {
            bg: '#fef2f2', // red-50
            border: '#ef4444', // red-500
            text: '#991b1b', // red-800
        },
        aviso: {
            bg: '#fef3c7', // amber-50
            border: '#f59e0b', // amber-500
            text: '#92400e', // amber-800
        },
        bloqueio: {
            bg: '#f1f5f9', // slate-50
            border: '#64748b', // slate-500
            text: '#334155', // slate-800
        },
        primary: '#2563eb',       // Blue-600 (Agua/Tecnico) - NOT PURPLE
        primaryHover: '#1d4ed8',  // Blue-700
        neutral: {
            bg: '#ffffff',
            border: '#e2e8f0', // slate-200
            text: '#0f172a',   // slate-900
            subtext: '#64748b' // slate-500
        }
    },
    radius: '2px',               // Sharp geometry for technical feel
    fontFamily: 'inherit',       // Uses project font
    spacing: {
        padding: '1.5rem',
        gap: '1rem'
    }
} as const;

// Mapeamento severidade → estilo visual
export const SEVERITY_STYLES: Record<string, keyof typeof COMPLIANCE_THEME.colors> = {
    IMPEDITIVA: 'naoConforme',
    AVISO: 'aviso',
    BLOQUEIO: 'bloqueio',
};

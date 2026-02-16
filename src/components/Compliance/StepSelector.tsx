import { TipoSistema } from '../../types/compliance';
import { COMPLIANCE_FIELDS } from '../../config/complianceFields';
import { COMPLIANCE_THEME } from '../../config/complianceTheme';

interface StepSelectorProps {
    onSelect: (tipo: TipoSistema) => void;
}

export function StepSelector({ onSelect }: StepSelectorProps) {
    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: COMPLIANCE_THEME.colors.primary }}>
                Qual sistema deseja validar?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.entries(COMPLIANCE_FIELDS) as [TipoSistema, typeof COMPLIANCE_FIELDS[TipoSistema]][]).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => onSelect(key)}
                        className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group text-left"
                        style={{ borderRadius: COMPLIANCE_THEME.radius }}
                    >
                        <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                            {config.icone}
                        </span>
                        <h3 className="text-xl font-semibold mb-2 text-slate-800">
                            {config.titulo}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                            {config.norma}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

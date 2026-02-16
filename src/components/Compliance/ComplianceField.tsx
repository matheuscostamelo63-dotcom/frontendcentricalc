import { CampoFormulario } from '../../config/complianceFields';
import { COMPLIANCE_THEME } from '../../config/complianceTheme';

interface ComplianceFieldProps {
    config: CampoFormulario;
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
}

export function ComplianceField({ config, value, onChange, error }: ComplianceFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = config.tipo === 'number' ? Number(e.target.value) : e.target.value;
        onChange(val);
    };

    const inputStyle = `w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 ${error ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-slate-300 focus:border-blue-500'
        }`;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
                {config.label}
                {config.obrigatorio && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                {config.tipo === 'select' ? (
                    <select
                        value={value as string}
                        onChange={handleChange}
                        className={inputStyle}
                        style={{ borderRadius: COMPLIANCE_THEME.radius }}
                    >
                        <option value="">Selecione...</option>
                        {config.opcoes?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={config.tipo}
                        value={value as string | number}
                        onChange={handleChange}
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        placeholder={config.placeholder}
                        className={inputStyle}
                        style={{ borderRadius: COMPLIANCE_THEME.radius }}
                    />
                )}

                {config.unidade && (
                    <span className="absolute right-3 top-2.5 text-slate-400 text-sm pointer-events-none">
                        {config.unidade}
                    </span>
                )}
            </div>

            {error && (
                <p className="mt-1 text-xs text-red-600 font-medium flex items-center">
                    {error}
                </p>
            )}
        </div>
    );
}

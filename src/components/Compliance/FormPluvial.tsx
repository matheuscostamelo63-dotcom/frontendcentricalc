import { useFormState } from '../../hooks/useCompliance';
import { COMPLIANCE_FIELDS } from '../../config/complianceFields';
import { ComplianceField } from './ComplianceField';
import { COMPLIANCE_THEME } from '../../config/complianceTheme';

interface FormPluvialProps {
    onSubmit: (dados: Record<string, unknown>) => void;
    loading: boolean;
}

export function FormPluvial({ onSubmit, loading }: FormPluvialProps) {
    const config = COMPLIANCE_FIELDS.pluvial;
    const { dados, handleChange } = useFormState({
        area_cobertura_m2: 150,
        intensidade_pluviometrica: 150,
        periodo_retorno_anos: 5
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(dados);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                    <span>{config.icone}</span>
                    Dados de Entrada - {config.norma}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.campos.map(campo => (
                        <ComplianceField
                            key={campo.key}
                            config={campo}
                            value={dados[campo.key as keyof typeof dados]}
                            onChange={(val) => handleChange(campo.key as keyof typeof dados, val)}
                        />
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        style={{ borderRadius: COMPLIANCE_THEME.radius, backgroundColor: COMPLIANCE_THEME.colors.primary }}
                    >
                        {loading ? 'Validando...' : 'Validar Drenagem'}
                    </button>
                </div>
            </div>
        </form>
    );
}

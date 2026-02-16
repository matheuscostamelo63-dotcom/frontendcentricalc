import { ValidationResponse, AlertaDetalhe } from '../../types/compliance';
import { COMPLIANCE_THEME, SEVERITY_STYLES } from '../../config/complianceTheme';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ResultsPanelProps {
    resultado: ValidationResponse;
}

export function ResultsPanel({ resultado }: ResultsPanelProps) {
    const { is_valid, norma, erros, avisos, parametros_calculados } = resultado;

    const renderAlertas = (lista: AlertaDetalhe[], titulo: string) => {
        if (!lista || lista.length === 0) return null;

        return (
            <div className="mb-6">
                <h4 className="font-semibold mb-3 text-slate-700">{titulo}</h4>
                <div className="space-y-3">
                    {lista.map((alerta, idx) => {
                        // Helper to get color config safely
                        const getSeverityColor = (key: string) => {
                            const styleKey = SEVERITY_STYLES[key] || 'aviso';
                            return COMPLIANCE_THEME.colors[styleKey] as { bg: string; border: string; text: string };
                        };

                        const estilo = getSeverityColor(alerta.severidade);

                        return (
                            <div
                                key={`${alerta.codigo}-${idx}`}
                                className="p-4 rounded-r-lg flex items-start gap-3 border-l-4"
                                style={{
                                    backgroundColor: estilo.bg,
                                    borderColor: estilo.border,
                                    borderLeftColor: estilo.border,
                                    color: estilo.text
                                }}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {alerta.severidade === 'IMPEDITIVA' && <XCircle size={18} />}
                                    {alerta.severidade === 'BLOQUEIO' && <XCircle size={18} />}
                                    {alerta.severidade === 'AVISO' && <AlertTriangle size={18} />}
                                </div>
                                <div>
                                    <span className="block font-bold text-xs uppercase tracking-wider opacity-80 mb-1">
                                        {alerta.codigo}
                                    </span>
                                    <span className="text-sm font-medium leading-relaxed">
                                        {alerta.mensagem}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
            {/* Header do Resultado */}
            <div
                className={`p-6 rounded-t-lg border border-b-0 flex items-center gap-4 ${is_valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
            >
                <div className="shrink-0">
                    {is_valid ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    )}
                </div>

                <div>
                    <h3 className={`text-xl font-bold ${is_valid ? 'text-green-800' : 'text-red-800'
                        }`}>
                        {is_valid ? 'Sistema Conforme' : 'Não Conforme'}
                    </h3>
                    <p className={`text-sm mt-1 ${is_valid ? 'text-green-600' : 'text-red-600'
                        }`}>
                        Validado segundo a norma {norma}
                    </p>
                </div>
            </div>

            {/* Corpo do Relatório */}
            <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg p-6 shadow-sm">

                {/* Parâmetros Calculados */}
                {parametros_calculados && Object.keys(parametros_calculados).length > 0 && (
                    <div className="mb-8 p-4 bg-slate-50 rounded border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                            Parâmetros Calculados
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                            {Object.entries(parametros_calculados).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-xs text-slate-400 capitalize mb-1">{key.replace(/_/g, ' ')}</p>
                                    <p className="font-mono text-slate-700 font-medium text-sm truncate" title={String(value)}>
                                        {String(value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Listas de Erros e Avisos */}
                {renderAlertas(erros, '🚨 Violações da Norma')}
                {renderAlertas(avisos, '⚠️ Recomendações')}

            </div>
        </div>
    );
}

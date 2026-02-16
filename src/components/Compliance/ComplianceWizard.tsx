import { useState } from 'react';
import { TipoSistema } from '../../types/compliance';
import { useCompliance } from '../../hooks/useCompliance';
import { StepSelector } from './StepSelector';
import { COMPLIANCE_THEME } from '../../config/complianceTheme';
import { ArrowLeft } from 'lucide-react';
import { FormEsgoto } from './FormEsgoto';
import { FormPluvial } from './FormPluvial';
import { FormIncendio } from './FormIncendio';
import { FormEfluentes } from './FormEfluentes';
import { ResultsPanel } from './ResultsPanel';

export function ComplianceWizard() {
    // 1. NAVEGAÇÃO
    const [tipoSistema, setTipoSistema] = useState<TipoSistema | null>(null);

    // 3. VALIDAÇÃO (via hook)
    const {
        resultado,
        loading,
        erro,
        validar,
        limpar
    } = useCompliance();

    const handleSelectSystem = (tipo: TipoSistema) => {
        setTipoSistema(tipo);
        limpar(); // Clear any previous results
    };

    const handleBack = () => {
        setTipoSistema(null);
        limpar();
    };

    const renderStep = () => {
        if (!tipoSistema) {
            return <StepSelector onSelect={handleSelectSystem} />;
        }

        return (
            <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-slate-50 min-h-[calc(100vh-100px)]">
                <div className="flex items-center mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mr-4 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm hover:shadow-md"
                        style={{ borderRadius: COMPLIANCE_THEME.radius }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Voltar
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Validação: <span style={{ color: COMPLIANCE_THEME.colors.primary }}>{tipoSistema.toUpperCase().replace('_', ' ')}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="order-1">
                        {tipoSistema === 'esgoto' && (
                            <FormEsgoto onSubmit={(d) => validar('esgoto', d)} loading={loading} />
                        )}
                        {tipoSistema === 'pluvial' && (
                            <FormPluvial onSubmit={(d) => validar('pluvial', d)} loading={loading} />
                        )}
                        {tipoSistema === 'incendio' && (
                            <FormIncendio onSubmit={(d) => validar('incendio', d)} loading={loading} />
                        )}
                        {tipoSistema === 'efluentes' && (
                            <FormEfluentes onSubmit={(d) => validar('efluentes', d)} loading={loading} />
                        )}
                    </div>

                    <div className="order-2 space-y-4">
                        {loading && (
                            <div className="p-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200 shadow-sm animate-pulse">
                                <p className="font-medium">Validando sistema junto à norma...</p>
                                <p className="text-xs mt-2">Isso pode levar alguns segundos.</p>
                            </div>
                        )}

                        {erro && (
                            <div className="p-6 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-sm">
                                <h4 className="font-bold flex items-center gap-2 mb-2">
                                    ❌ Erro na Validação
                                </h4>
                                <p className="text-sm">
                                    {erro.body?.error || 'Ocorreu um erro na conexão com a API.'}
                                </p>
                                {erro.body?.requeridos && (
                                    <div className="mt-3 text-xs bg-red-100 p-2 rounded">
                                        <strong>Campos obrigatórios faltando:</strong> {erro.body.requeridos.join(', ')}
                                    </div>
                                )}
                                <div className="mt-4 text-xs opacity-70">
                                    Código: {erro.status} | Tipo: {erro.tipo}
                                </div>
                            </div>
                        )}

                        {resultado && <ResultsPanel resultado={resultado} />}

                        {!loading && !erro && !resultado && (
                            <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                                <p>Preencha os dados e clique em validar para ver a análise de conformidade.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm z-10 relative">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        <span style={{ color: COMPLIANCE_THEME.colors.primary }}>CentriCalc Compliance</span>
                    </h1>
                </div>
            </header>

            <main>
                {renderStep()}
            </main>
        </div>
    );
}

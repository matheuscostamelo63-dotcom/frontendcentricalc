import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { TipoSistema } from '@/services/vazaoService';

// Mapping from system type to NBR standard
const TIPO_SISTEMA_TO_NORMA: Record<string, string> = {
  agua_fria: 'NBR 5626',
  esgoto: 'NBR 8160',
  pluvial: 'NBR 10844',
  incendio: 'NBR 13714',
  efluentes: 'NBR 13969'
};

interface SistemaContextType {
  tipoSistema: TipoSistema | null;
  setTipoSistema: (tipo: TipoSistema | null) => void;
  normaSelecionada: string | null;
  validationEnabled: boolean;
  setValidationEnabled: (enabled: boolean) => void;
}

const SistemaContext = createContext<SistemaContextType | undefined>(undefined);

export const SistemaProvider = ({ children }: { children: ReactNode }) => {
  const [tipoSistema, setTipoSistema] = useState<TipoSistema | null>(null);
  const [validationEnabled, setValidationEnabled] = useState(false);

  // Automatically derive normaSelecionada from tipoSistema
  const normaSelecionada = useMemo(() => {
    if (!tipoSistema) return null;
    return TIPO_SISTEMA_TO_NORMA[tipoSistema] || null;
  }, [tipoSistema]);

  return (
    <SistemaContext.Provider value={{
      tipoSistema,
      setTipoSistema,
      normaSelecionada,
      validationEnabled,
      setValidationEnabled
    }}>
      {children}
    </SistemaContext.Provider>
  );
};

export const useSistema = () => {
  const context = useContext(SistemaContext);
  if (context === undefined) {
    throw new Error('useSistema must be used within a SistemaProvider');
  }
  return context;
};

// Export the mapping for use in other modules
export { TIPO_SISTEMA_TO_NORMA };
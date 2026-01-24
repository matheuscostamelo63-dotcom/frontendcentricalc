import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TipoSistema } from '@/services/vazaoService';

interface SistemaContextType {
  tipoSistema: TipoSistema | null;
  setTipoSistema: (tipo: TipoSistema | null) => void;
}

const SistemaContext = createContext<SistemaContextType | undefined>(undefined);

export const SistemaProvider = ({ children }: { children: ReactNode }) => {
  const [tipoSistema, setTipoSistema] = useState<TipoSistema | null>(null);

  return (
    <SistemaContext.Provider value={{ tipoSistema, setTipoSistema }}>
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
import React, { createContext, useContext, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

type CleanupFn = () => void;

interface PortalCleanupContextType {
  register: (fn: CleanupFn) => () => void;
}

const PortalCleanupContext = createContext<PortalCleanupContextType | null>(null);

export const PortalCleanupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const cleanupsRef = useRef<Set<CleanupFn>>(new Set());

  const register = (fn: CleanupFn) => {
    cleanupsRef.current.add(fn);
    return () => {
      cleanupsRef.current.delete(fn);
    };
  };

  useEffect(() => {
    // 🔥 FECHA TUDO ANTES DA TROCA DE ROTA FINALIZAR
    cleanupsRef.current.forEach((cleanup) => {
      try {
        cleanup();
      } catch {
        // silêncio proposital: cleanup nunca deve quebrar navegação
      }
    });

    // Limpa toasts do Sonner explicitamente
    toast.dismiss();
  }, [location.pathname]);

  return (
    <PortalCleanupContext.Provider value={{ register }}>
      {children}
    </PortalCleanupContext.Provider>
  );
};

export const usePortalCleanup = () => {
  const ctx = useContext(PortalCleanupContext);
  if (!ctx) {
    throw new Error(
      "usePortalCleanup must be used inside PortalCleanupProvider"
    );
  }
  return ctx;
};
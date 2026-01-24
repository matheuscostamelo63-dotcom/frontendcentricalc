import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Define a função de callback uma única vez
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Inicializa o estado
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Adiciona e remove o listener
    mql.addEventListener("change", onChange);
    
    return () => mql.removeEventListener("change", onChange);
  }, []); // Dependência vazia garante que roda apenas na montagem

  // Retorna false se ainda não montado (SSR/Hydration safety)
  return isMobile ?? false;
}
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
import Index from "@/pages/Index";
import MeusProjetos from "@/pages/MeusProjetos";
import Sobre from "@/pages/Sobre";
import ProjectDetails from "@/pages/ProjectDetails";
import ReservatorioPage from "@/pages/Reservatorio";
import NotFound from "@/pages/NotFound";
import { ExemploIntegracao } from "@/components/alertas";

// Função para remover portais órfãos do Radix
const cleanupRadixPortals = () => {
  // Remove todos os portais do Radix que possam estar órfãos
  const portalSelectors = [
    '[data-radix-portal]',
    '[data-radix-popper-content-wrapper]',
    '[vaul-drawer-wrapper]',
    '[data-sonner-toast]',
  ];

  portalSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      try {
        el.remove();
      } catch (e) {
        // Ignora erros se o elemento já foi removido
      }
    });
  });
};

export const SafeRoutes = () => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  // useLayoutEffect roda ANTES do browser pintar - mais seguro para limpeza de DOM
  useLayoutEffect(() => {
    if (previousPath.current !== location.pathname) {
      cleanupRadixPortals();
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);

  // Cleanup adicional no unmount
  useEffect(() => {
    return () => {
      cleanupRadixPortals();
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/reservatorio" element={<ReservatorioPage />} />
      <Route path="/meus-projetos" element={<MeusProjetos />} />
      <Route path="/meus-projetos/:id" element={<ProjectDetails />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/alertas-exemplo" element={<ExemploIntegracao />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
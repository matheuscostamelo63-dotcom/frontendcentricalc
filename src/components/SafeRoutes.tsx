import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
import Index from "@/pages/Index";
import MeusProjetos from "@/pages/MeusProjetos";
import Sobre from "@/pages/Sobre";
import ProjectDetails from "@/pages/ProjectDetails";
import ReservatorioPage from "@/pages/Reservatorio";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import { ExemploIntegracao } from "@/components/alertas";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Função para remover portais órfãos do Radix
const cleanupRadixPortals = () => {
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
      {/* Rotas Públicas de Autenticação (sem sidebar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rotas Protegidas: redirecionam para /login se não autenticado */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/reservatorio" element={<ProtectedRoute><ReservatorioPage /></ProtectedRoute>} />
      <Route path="/meus-projetos" element={<ProtectedRoute><MeusProjetos /></ProtectedRoute>} />
      <Route path="/meus-projetos/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path="/sobre" element={<ProtectedRoute><Sobre /></ProtectedRoute>} />
      <Route path="/alertas-exemplo" element={<ProtectedRoute><ExemploIntegracao /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
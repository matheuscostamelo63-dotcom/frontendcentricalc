import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/Sidebar";
import { SafeRoutes } from "@/components/SafeRoutes";
import { PortalErrorBoundary } from "@/components/PortalErrorBoundary";
import { SistemaProvider } from "@/context/SistemaContext";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient();

// Auth routes that should NOT show the sidebar
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

function AppLayout() {
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTES.some(route => location.pathname.startsWith(route));

  if (isAuthRoute) {
    return <SafeRoutes />;
  }

  return (
    <PortalErrorBoundary>
      <SistemaProvider>
        <TooltipProvider delayDuration={300}>
          <Sonner />
          <div className="flex min-h-screen w-full bg-background">
            <Sidebar />
            <main className="flex-1 lg:ml-64 pt-4 md:pt-8">
              <SafeRoutes />
            </main>
          </div>
        </TooltipProvider>
      </SistemaProvider>
    </PortalErrorBoundary>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <BrowserRouter>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
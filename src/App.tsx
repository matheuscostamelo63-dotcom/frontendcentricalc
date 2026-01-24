import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/Sidebar";
import { SafeRoutes } from "@/components/SafeRoutes";
import { PortalErrorBoundary } from "@/components/PortalErrorBoundary";
import { SistemaProvider } from "@/context/SistemaContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <BrowserRouter>
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
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
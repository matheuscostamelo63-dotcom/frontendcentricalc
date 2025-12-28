import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/Sidebar";
import Index from "./pages/Index";
import MeusProjetos from "./pages/MeusProjetos";
import Sobre from "./pages/Sobre";
import ProjectDetails from "./pages/ProjectDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <BrowserRouter>
        <TooltipProvider>
          <Sonner />
          <div className="flex min-h-screen w-full bg-background">
            <Sidebar />
            <main className="flex-1 lg:ml-64 pt-4 md:pt-8">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/meus-projetos" element={<MeusProjetos />} />
                <Route path="/meus-projetos/:id" element={<ProjectDetails />} />
                <Route path="/sobre" element={<Sobre />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </TooltipProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
import { Calculator, FolderOpen, FileText, Menu, X, Home } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Start closed on mobile

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card border border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 flex flex-col`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-center">
              <img
                src="/logo.png"
                alt="CentriCalc Logo"
                className="h-10 w-auto" // Reduced logo size for better fit
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <NavLink
              to="/"
              end
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsOpen(false)} // Close sidebar on navigation (mobile)
            >
              <Calculator className="h-5 w-5" />
              <span className="font-medium">Novo Dimensionamento</span>
            </NavLink>
            
            <NavLink
              to="/reservatorio"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Cálculo Reservatório</span>
            </NavLink>

            <NavLink
              to="/meus-projetos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsOpen(false)}
            >
              <FolderOpen className="h-5 w-5" />
              <span className="font-medium">Meus Projetos</span>
            </NavLink>

            <NavLink
              to="/sobre"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Sobre</span>
            </NavLink>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-3">
            <ThemeToggle />
            <p className="text-xs text-muted-foreground text-center">
              Versão 1.0.0
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
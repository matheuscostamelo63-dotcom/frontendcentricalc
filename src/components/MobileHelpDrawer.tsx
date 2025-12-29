import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMounted } from "@/hooks/use-mounted";

interface MobileHelpDrawerProps {
  title: string;
  children: React.ReactNode;
}

export const MobileHelpDrawer = ({ title, children }: MobileHelpDrawerProps) => {
  const isMobile = useIsMobile();
  const mounted = useMounted();
  const [isOpen, setIsOpen] = useState(false);
  const isMountedRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      // Cancela qualquer requestAnimationFrame pendente
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Handler seguro com requestAnimationFrame
  const handleOpenChange = useCallback((open: boolean) => {
    // Cancela operação anterior se existir
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Usa RAF para sincronizar com o ciclo de renderização do browser
    rafIdRef.current = requestAnimationFrame(() => {
      if (isMountedRef.current) {
        setIsOpen(open);
      }
    });
  }, []);

  // Fecha ao mudar modo mobile/desktop
  useEffect(() => {
    if (isMountedRef.current && isOpen) {
      handleOpenChange(false);
    }
  }, [isMobile, handleOpenChange]);

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0 text-muted-foreground cursor-pointer">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0 text-sm text-muted-foreground space-y-2">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          {children}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
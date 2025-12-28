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
import React, { useState, useEffect } from "react";
import { useMounted } from "@/hooks/use-mounted";

interface MobileHelpDrawerProps {
  title: string;
  children: React.ReactNode;
}

export const MobileHelpDrawer = ({ title, children }: MobileHelpDrawerProps) => {
  const isMobile = useIsMobile();
  const mounted = useMounted();
  const [isOpen, setIsOpen] = useState(false);

  // 1. Cleanup: Garante que o portal feche ao desmontar o componente.
  useEffect(() => {
    return () => {
      // Se o componente for desmontado (ex: mudança de rota ou remoção de item da lista),
      // forçamos o fechamento do portal.
      setIsOpen(false);
    };
  }, []);

  // 2. Reset ao mudar de modo: Se o modo mobile/desktop mudar, forçamos o fechamento
  // para evitar que o portal do modo anterior persista.
  useEffect(() => {
    setIsOpen(false);
  }, [isMobile]);


  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
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

  // Desktop: Use standard Tooltip
  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
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
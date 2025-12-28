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
import React from "react";
import { useMounted } from "@/hooks/use-mounted";

interface MobileHelpDrawerProps {
  title: string;
  children: React.ReactNode;
}

export const MobileHelpDrawer = ({ title, children }: MobileHelpDrawerProps) => {
  const isMobile = useIsMobile();
  const mounted = useMounted();

  if (!mounted) {
    // Renderiza um placeholder leve no servidor/hidratação
    return (
      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help opacity-0" />
    );
  }

  if (isMobile) {
    return (
      <Drawer>
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
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        {children}
      </TooltipContent>
    </Tooltip>
  );
};
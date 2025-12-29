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
import React, { useState, useEffect, useRef } from "react";
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

  // Track mounted state with ref (não causa re-render)
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset ao mudar de modo mobile/desktop
  useEffect(() => {
    if (isMountedRef.current) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Handler seguro para mudança de estado
  const handleOpenChange = (open: boolean) => {
    if (isMountedRef.current) {
      setIsOpen(open);
    }
  };

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
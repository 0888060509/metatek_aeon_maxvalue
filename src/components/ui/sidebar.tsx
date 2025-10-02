"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Menu } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { Button, type ButtonProps } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

// SIDENAV
const sidenavVariants = cva(
  "group fixed inset-y-0 z-20 flex h-full flex-col border-r bg-background transition-all",
  {
    variants: {
      collapsible: {
        icon: "w-14",
        full: "w-56",
      },
    },
    defaultVariants: {
      collapsible: "full",
    },
  }
);

export const SidebarContext = React.createContext<{
  collapsible?: "icon" | "full" | null;
  setCollapsible?: React.Dispatch<React.SetStateAction<"icon" | "full">>;
}>({});

export function SidebarProvider({ children }: React.PropsWithChildren) {
  const isMobile = useIsMobile();
  const [collapsible, setCollapsible] = React.useState<"icon" | "full">(
    isMobile ? "icon" : "full"
  );

  return (
    <SidebarContext.Provider
      value={{
        collapsible: isMobile ? null : collapsible,
        setCollapsible: isMobile ? undefined : setCollapsible,
      }}
    >
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { collapsible } = React.useContext(SidebarContext);

  return (
    <div
      ref={ref}
      className={cn(
        sidenavVariants({ collapsible: collapsible ?? undefined }),
        className
      )}
      data-collapsible={collapsible}
      {...props}
    >
      {children}
    </div>
  );
});
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-16 shrink-0 items-center px-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props}>
      {children}
    </div>
  );
});
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-auto border-t p-2 group-data-[collapsible=icon]:p-1",
      className
    )}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "flex flex-col gap-1 px-4 py-2 group-data-[collapsible=icon]:items-center",
      className
    )}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => <li ref={ref} className={cn(className)} {...props} />);
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { isActive?: boolean; tooltip?: string }
>(({ isActive, className, tooltip, children, ...props }, ref) => {
  const { collapsible } = React.useContext(SidebarContext);
  const isIconButton = collapsible === "icon";

  const button = (
    <Button
      ref={ref}
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        isIconButton && "h-10 w-10 justify-center",
        className
      )}
      {...props}
    >
      {isIconButton ? (
        <>{React.Children.toArray(children)[0]}</>
      ) : (
        <>{children}</>
      )}
    </Button>
  );

  if (isIconButton && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const MAIN_CONTENT_VARIANTS = cva("transition-all", {
  variants: {
    collapsible: {
      icon: "md:ml-14",
      full: "md:ml-56",
    },
  },
  defaultVariants: {
    collapsible: "full",
  },
});

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { collapsible } = React.useContext(SidebarContext);

  return (
    <div
      ref={ref}
      className={cn(
        MAIN_CONTENT_VARIANTS({
          collapsible: collapsible ?? undefined,
        }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarInset.displayName = "SidebarInset";

export function SidebarTrigger({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const { setCollapsible } = React.useContext(SidebarContext);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className={cn(className)}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-56 p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={() =>
        setCollapsible?.((prev) => (prev === "full" ? "icon" : "full"))
      }
    >
      <Menu />
    </Button>
  );
}

// Re-export AppSidebar to avoid circular dependency
import { AppSidebar } from "@/components/app-sidebar";

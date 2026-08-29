import {
  Content as TooltipContentPrimitive,
  Provider as TooltipProviderPrimitive,
  Root as TooltipRoot,
  Trigger as TooltipTriggerPrimitive,
} from "@radix-ui/react-tooltip";
import { cn } from "libs/Utils";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

const TooltipProvider = TooltipProviderPrimitive;

const Tooltip = TooltipRoot;

const TooltipTrigger = TooltipTriggerPrimitive;

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipContentPrimitive>,
  ComponentPropsWithoutRef<typeof TooltipContentPrimitive>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipContentPrimitive
    className={cn(
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded bg-gray-900 px-3 py-1.5 text-gray-50 text-xs data-[state=closed]:animate-out dark:bg-gray-50 dark:text-gray-900",
      className
    )}
    ref={ref}
    sideOffset={sideOffset}
    {...props}
  />
));
TooltipContent.displayName = TooltipContentPrimitive.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

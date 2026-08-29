import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Action as ToastActionPrimitive,
  Close as ToastClosePrimitive,
  Description as ToastDescriptionPrimitive,
  Provider as ToastProviderPrimitive,
  Root as ToastRootPrimitive,
  Title as ToastTitlePrimitive,
  Viewport as ToastViewportPrimitive,
} from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "libs/Utils";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
  type ReactElement,
} from "react";

const ToastProvider = ToastProviderPrimitive;

const ToastViewport = forwardRef<
  ElementRef<typeof ToastViewportPrimitive>,
  ComponentPropsWithoutRef<typeof ToastViewportPrimitive>
>(({ className, ...props }, ref) => (
  <ToastViewportPrimitive
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
      className
    )}
    ref={ref}
    {...props}
  />
));
ToastViewport.displayName = ToastViewportPrimitive.displayName;

const toastVariants = cva(
  "group data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded border border-gray-200 p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[swipe=move]:transition-none dark:border-gray-800",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default:
          "border bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50",
        destructive:
          "destructive group border-red-500 bg-red-500 text-gray-50 dark:border-red-900 dark:bg-red-900 dark:text-gray-50",
      },
    },
  }
);

const Toast = forwardRef<
  ElementRef<typeof ToastRootPrimitive>,
  ComponentPropsWithoutRef<typeof ToastRootPrimitive> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastRootPrimitive
    className={cn(toastVariants({ variant }), className)}
    ref={ref}
    {...props}
  />
));
Toast.displayName = ToastRootPrimitive.displayName;

const ToastAction = forwardRef<
  ElementRef<typeof ToastActionPrimitive>,
  ComponentPropsWithoutRef<typeof ToastActionPrimitive>
>(({ className, ...props }, ref) => (
  <ToastActionPrimitive
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded border border-gray-200 bg-transparent px-3 font-medium text-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-gray-100/40 group-[.destructive]:focus:ring-red-500 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-gray-50 dark:border-gray-800 dark:group-[.destructive]:border-gray-800/40 dark:focus:ring-gray-300 dark:group-[.destructive]:focus:ring-red-900 dark:hover:bg-gray-800 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-gray-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
ToastAction.displayName = ToastActionPrimitive.displayName;

const ToastClose = forwardRef<
  ElementRef<typeof ToastClosePrimitive>,
  ComponentPropsWithoutRef<typeof ToastClosePrimitive>
>(({ className, ...props }, ref) => (
  <ToastClosePrimitive
    className={cn(
      "absolute top-1 right-1 rounded p-1 text-gray-950/50 opacity-0 transition-opacity hover:text-gray-950 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 group-[.destructive]:hover:text-red-50 dark:text-gray-50/50 dark:hover:text-gray-50",
      className
    )}
    ref={ref}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="h-4 w-4" />
  </ToastClosePrimitive>
));
ToastClose.displayName = ToastClosePrimitive.displayName;

const ToastTitle = forwardRef<
  ElementRef<typeof ToastTitlePrimitive>,
  ComponentPropsWithoutRef<typeof ToastTitlePrimitive>
>(({ className, ...props }, ref) => (
  <ToastTitlePrimitive
    className={cn("font-semibold text-sm [&+div]:text-xs", className)}
    ref={ref}
    {...props}
  />
));
ToastTitle.displayName = ToastTitlePrimitive.displayName;

const ToastDescription = forwardRef<
  ElementRef<typeof ToastDescriptionPrimitive>,
  ComponentPropsWithoutRef<typeof ToastDescriptionPrimitive>
>(({ className, ...props }, ref) => (
  <ToastDescriptionPrimitive
    className={cn("text-sm opacity-90", className)}
    ref={ref}
    {...props}
  />
));
ToastDescription.displayName = ToastDescriptionPrimitive.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  type ToastActionElement,
  ToastClose,
  ToastDescription,
  type ToastProps,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};

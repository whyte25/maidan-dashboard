"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/ui/notify/notify-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <TooltipProvider>
          <ToastProvider preventDuplicates>{children}</ToastProvider>
        </TooltipProvider>
      </QueryProvider>
    </NuqsAdapter>
  );
}

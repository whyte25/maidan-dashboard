"use client";

import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/ui/notify/notify-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TopLoader } from "../top-loader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <TopLoader />
      <QueryProvider>
        <TooltipProvider>
          <ToastProvider preventDuplicates>{children}</ToastProvider>
        </TooltipProvider>
      </QueryProvider>
    </NuqsAdapter>
  );
}

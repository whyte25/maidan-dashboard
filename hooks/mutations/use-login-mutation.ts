"use client";

import { toast } from "@/components/ui/notify";
import { AUTH_COOKIE_NAME, MOCK_AUTH } from "@/constants/auth";
import { ClientCookies } from "@/lib/cookies.client";
import type { LoginFormData } from "@/validations/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (
        data.identifier === MOCK_AUTH.identifier &&
        data.password === MOCK_AUTH.password
      ) {
        return { success: true };
      }

      throw new Error("Invalid identifier or password");
    },
    onSuccess: () => {
      ClientCookies.set(AUTH_COOKIE_NAME, "true");
      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      });
      router.push("/dashboard/products");
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message,
      });
    },
  });
}

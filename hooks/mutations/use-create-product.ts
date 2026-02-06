import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/notify";
import { QUERY_KEY } from "@/constants/query_key";
import { createProduct } from "@/services/actions";
import type { ProductFormValues } from "@/validations/product";

export function useCreateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormValues) => createProduct(data),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
      router.push("/dashboard/products");
    },
    onError: (error: Error) => {
      toast.error("Failed to create product", {
        description: error.message || "An error occurred",
      });
    },
  });
}

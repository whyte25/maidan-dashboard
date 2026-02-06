import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/notify";
import { QUERY_KEY } from "@/constants/query_key";
import { updateProduct } from "@/services/actions";
import type { ProductFormValues } from "@/validations/product";
import { Route } from "next";

interface UpdateProductParams {
  id: string;
  data: ProductFormValues | Partial<ProductFormValues>;
  redirectTo?: string;
}

export function useUpdateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductParams) =>
      updateProduct(id, data as ProductFormValues),
    onSuccess: (_, { redirectTo = "/dashboard/products" }) => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
      if (redirectTo !== "none") {
        router.push(redirectTo as Route);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to update product", {
        description: error.message || "An error occurred",
      });
    },
  });
}

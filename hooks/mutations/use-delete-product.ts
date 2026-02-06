import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/notify";
import { QUERY_KEY } from "@/constants/query_key";
import { deleteProduct } from "@/services/actions";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onMutate: async (id) => {
      toast.loading("Deleting product...", {
        id: "delete-product",
      });
    },
    onSuccess: (result, variables, context) => {
      console.log(result, variables, context);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCTS] });
      toast.dismiss("delete-product");
      toast.success(` Product deleted successfully`, {
        id: "delete-product",
      });
    },
    onError: (error: Error) => {
      toast.dismiss("delete-product");
      toast.error("Failed to delete product", {
        description: error.message || "An error occurred",
      });
    },
  });
}

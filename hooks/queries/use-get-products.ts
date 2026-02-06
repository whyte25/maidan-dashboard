import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "@/constants/query_key";
import { getProducts } from "@/services/actions";
import type { GetProductsParams } from "@/types.d";

export function useGetProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCTS, params],
    queryFn: () => getProducts(params),
  });
}

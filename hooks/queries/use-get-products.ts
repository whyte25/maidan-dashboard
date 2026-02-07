import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "@/constants/query_key";
import { getProducts, getProductsCount } from "@/services/actions";
import type { GetProductsParams } from "@/types.d";

export function useGetProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCTS, params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetProductsCount(params: GetProductsParams = {}) {
  const { page, limit, ...countParams } = params;
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCTS, "count", countParams],
    queryFn: () => getProductsCount(countParams),
  });
}

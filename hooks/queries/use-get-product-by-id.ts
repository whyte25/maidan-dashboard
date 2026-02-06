import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY } from "@/constants/query_key";
import { getProductById } from "@/services/actions";

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCTS, id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}

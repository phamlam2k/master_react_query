import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../utils/keys";
import { getProductDetail } from "../utils/api/product";

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAIL],
    queryFn: () => getProductDetail(id),
    enabled: !!id && id !== "",
  });
};

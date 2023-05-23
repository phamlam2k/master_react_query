import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../utils/keys";
import { getProductList } from "../utils/api/product";

export const useProductList = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_LIST, page, limit],
    queryFn: () => getProductList({ page, limit }),
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });
};

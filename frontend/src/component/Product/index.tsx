import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Link, useSearchParams } from "react-router-dom";

import { useProductList } from "../../hooks/useProductList";
import { IProductItem } from "../../models/api";
import { Pagination } from "../../common/pagination";

import { deleteProduct } from "../../utils/api/product";
import { QUERY_KEYS } from "../../utils/keys";

export const ProductListPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState<number>(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );
  const [limit, setLimit] = useState<number>(
    searchParams.get("limit") ? Number(searchParams.get("limit")) : 5
  );

  // Hàm thao tác gọi product list
  const {
    data: product_list,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
  } = useProductList({ page, limit });

  const { mutate, isLoading: isLoadingDeleteProduct } = useMutation({
    mutationFn: async (id: string) => await deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.PRODUCT_LIST]);
    },
  });

  // Hàm thao tác xoá product
  const handleDelete = (id: string) => {
    mutate(id);
  };

  const handleChangePage = (page: number) => {
    setPage(page);
    setSearchParams({ page: String(page) });
  };

  const handleChangeLimit = (limit: number) => {
    setLimit(limit);
  };

  if (isLoadingProduct) {
    return <div>Loading</div>;
  }

  if (isErrorProduct) {
    return <div>Error</div>;
  }

  return (
    <div className="w-full pt-[20px]">
      <Link to="/create_product" className="mx-auto w-fit block">
        Create Product
      </Link>
      <div className="w-[600px] mx-auto mt-[20px]">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {product_list.items.map((product: IProductItem) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={product.id}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {product.name}
                </th>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="flex items-center px-6 py-4 text-[#FFFFFF] gap-[10px] justify-center">
                  <Link
                    to={`product/${product.id}`}
                    className="py-[5px] px-[10px] bg-green-400"
                  >
                    Detail
                  </Link>
                  <Link
                    to={`edit_product/${product.id}`}
                    className="py-[5px] px-[10px] bg-blue-400"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={isLoadingDeleteProduct}
                    className="py-[5px] px-[10px] bg-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        perPage={product_list.perPage}
        page={product_list.page}
        totalItems={product_list.totalItems}
        totalPages={product_list.totalPages}
        handleChangePage={handleChangePage}
        handleChangeLimit={handleChangeLimit}
      />
    </div>
  );
};

import { API_BASE_URL } from ".";
import axiosInstance from "../../common/axios";
import { IProductItem, IProductItemDataRepsonse } from "../../models/api";

export const getProductList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<IProductItemDataRepsonse> => {
  const { data } = await axiosInstance.get(
    `${API_BASE_URL}/api/collections/product/records?page=${page}&perPage=${limit}`
  );

  return data;
};

export const createProduct = async (data: {
  name: string;
  price: string;
  description: string;
}): Promise<any> => {
  const response = await axiosInstance.post(
    `${API_BASE_URL}/api/collections/product/records`,
    data
  );

  return response;
};

export const deleteProduct = async (id: string) => {
  const { data } = await axiosInstance.delete(
    `${API_BASE_URL}/api/collections/product/records/${id}`
  );

  return data;
};

export const getProductDetail = async (id: string): Promise<IProductItem> => {
  const { data } = await axiosInstance.get(
    `${API_BASE_URL}/api/collections/product/records/${id}`
  );

  return data;
};

export const updateProduct = async (data: {
  id?: string;
  name?: string;
  price?: string;
  description?: string;
}) => {
  const response = await axiosInstance.patch(
    `${API_BASE_URL}/api/collections/product/records/${data.id}`,
    data
  );

  return response;
};

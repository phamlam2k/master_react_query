import axios, { AxiosError } from "axios";
import { useState, useMemo, ChangeEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useProductDetail } from "../../hooks/useProductDetail";
import { IProductItem } from "../../models/api";

import { updateProduct } from "../../utils/api/product";
import { QUERY_KEYS } from "../../utils/keys";

interface State {
  name: string;
  description: string;
  price: string;
}

interface ErrorMessage {
  code: string;
  message: string;
}

const initialErrorState: ErrorMessage = {
  code: "",
  message: "",
};

export const EditProductPage = () => {
  const param: { id?: string } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [data, setData] = useState<State>({
    name: "",
    description: "",
    price: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    name: initialErrorState,
    description: initialErrorState,
    price: initialErrorState,
  });

  const productId: string = useMemo(() => {
    if (param.id) {
      return param.id;
    }
    return "";
  }, [param]);

  const { data: product, isLoading: isLoadingProduct } =
    useProductDetail(productId);

  useEffect(() => {
    if (product) {
      setData({
        name: product.name,
        description: product.description,
        price: product.price,
      });
    }
  }, [product]);

  const { mutate, isLoading: isCreateLoadingProduct } = useMutation({
    mutationFn: async (data: State): Promise<any> =>
      await updateProduct({ ...data, id: productId }),
    onSuccess: async (res: { data: IProductItem; status: number }) => {
      if (res.status === 200) {
        queryClient.setQueryData(
          [QUERY_KEYS.PRODUCT_DETAIL, productId],
          (old: IProductItem | undefined) => (old ? res.data : old)
        );

        toast.success("Edit Product successfully");
        navigate("/");
      }
    },
    onError: (error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        const response = error.response?.data;

        setErrorMessage({
          ...errorMessage,
          ...response.data,
        });

        toast.error(response.message);
      } else {
        toast.error("Some thing went wrong, please try again");
      }
    },
  });

  const handleChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setData((props: State) => ({ ...props, [key]: e.target.value }));
  };

  const onSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    mutate(data);
  };

  if (isLoadingProduct) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            onChange={handleChange("name")}
            defaultValue={product?.name}
          />
          <p style={{ color: "red" }}>{errorMessage.name.message}</p>
        </div>
        <div>
          <label>Product Description:</label>
          <input
            type="text"
            onChange={handleChange("description")}
            defaultValue={product?.description}
          />
          <p style={{ color: "red" }}>{errorMessage.description.message}</p>
        </div>
        <div>
          <label>Product Price:</label>
          <input
            type="text"
            onChange={handleChange("price")}
            defaultValue={product?.price}
          />
          <p style={{ color: "red" }}>{errorMessage.price.message}</p>
        </div>
        <button type="submit" disabled={isCreateLoadingProduct}>
          Create
        </button>
      </form>
    </div>
  );
};

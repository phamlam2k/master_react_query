import axios, { AxiosError } from "axios";
import { useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IProductItem, IProductItemDataRepsonse } from "../../models/api";
import { createProduct } from "../../utils/api/product";
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

export const CreateProductPage = () => {
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

  const { mutate, isLoading: isCreateLoadingProduct } = useMutation({
    mutationFn: async (data: State): Promise<any> => await createProduct(data),
    onSuccess: async (res: { data: IProductItem; status: number }) => {
      if (res.status === 200) {
        queryClient.invalidateQueries([QUERY_KEYS.PRODUCT_LIST]);

        const previousTodos = queryClient.getQueryData([
          QUERY_KEYS.PRODUCT_DETAIL,
          res.data.id,
        ]);

        queryClient.setQueryData(
          [QUERY_KEYS.PRODUCT_DETAIL, res.data.id],
          (old: IProductItem | undefined) => (old ? res.data : old)
        );

        toast.success("Create Product successfully");
        navigate(`/product/${res.data.id}`, { replace: true });

        return { previousTodos };
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

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>Product Name:</label>
          <input type="text" onChange={handleChange("name")} />
          <p style={{ color: "red" }}>{errorMessage.name.message}</p>
        </div>
        <div>
          <label>Product Description:</label>
          <input type="text" onChange={handleChange("description")} />
          <p style={{ color: "red" }}>{errorMessage.description.message}</p>
        </div>
        <div>
          <label>Product Price:</label>
          <input type="text" onChange={handleChange("price")} />
          <p style={{ color: "red" }}>{errorMessage.price.message}</p>
        </div>
        <button type="submit" disabled={isCreateLoadingProduct}>
          Create
        </button>
      </form>
    </div>
  );
};

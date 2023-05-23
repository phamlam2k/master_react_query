import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../../hooks/useProductDetail";

export const DetailProductPage = () => {
  const param: { id?: string } = useParams();

  const productId: string = useMemo(() => {
    if (param.id) {
      return param.id;
    }
    return "";
  }, [param]);

  const {
    data: product,
    isLoading: isLoadingProduct,
    isError,
  } = useProductDetail(productId);

  if (isLoadingProduct) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <div>Name: {product.name}</div>
      <div>Description: {product.description}</div>
      <div>Price: {product.price}</div>
    </div>
  );
};
